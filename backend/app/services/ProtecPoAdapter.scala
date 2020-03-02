package services

import data.{Resistance, Substance}
import javax.inject._
import org.jsoup.Jsoup
import play.api.Configuration
import play.api.libs.ws.{WSClient, WSCookie}

import scala.concurrent.{ExecutionContext, Future}
import scala.jdk.CollectionConverters._
import scala.util.Success

/**
 * This service queries ProtecPo to extract its information.
 * <br>Beware, it has been observed that ProtecPo is hosted on an old and inefficient machine.
 * <br> - Parallel requests are NOT recommended (~20 simultaneous requests are enough to CRASH the site)
 * <br> - A special Java security file MUST be provided in order for Java to use the outdated ciphersuites
 */
@Singleton
class ProtecPoAdapter @Inject()(httpClient: WSClient, config: Configuration)(implicit ec: ExecutionContext) {
  lazy val baseUrl: String = {
    val secure = config.get[Boolean]("protecpo.secure")
    val domain = config.get[String]("protecpo.domain")

    (if (secure) "https" else "http") + "://" + domain + "/"
  }

  /**
   * An object holding the Session Cookie for ProtecPo.<br>
   * ProtecPo requires requests to be made with a session in which the non-responsibility clause has been accepted
   */
  object SessionCookie {
    private var cookie: Option[WSCookie] = None
    private var lastRefresh: Long = 0L

    /**
     * Runs a request to validate the non-responsibility clause and to switch the site in English, then returns
     * the new session cookie.
     */
    private def loadSessionCookie = {
      httpClient.url(baseUrl + "servlet/ValiderClause")
        .post(Map("secteurActivite" -> Seq("0"), "tailleEntreprise" -> Seq("0")))
        .map(res => res.cookie("JSESSIONID"))
        .filter(cookie => cookie.isDefined)
        .map(cookie => cookie.get)
        .andThen {
          case Success(cookie) =>
            this.cookie = Some(cookie)
            this.lastRefresh = System.currentTimeMillis()

        }
        .flatMap(cookie => {
          httpClient.url(baseUrl + "jsp/RechercheParSolvant.jsp?langue=EN")
            .withCookies(cookie)
            .get()
            .map(_ => cookie) // replace the result with the same cookie
        })
    }

    private def isExpired = !cookie.map(c => lastRefresh + (c.maxAge.getOrElse(0L) - 30L))
      .exists(_ > System.currentTimeMillis)

    /**
     * Gets the current session cookie. If this cookie is not present or expired, it will be queried first.
     * @return the session cookie used by ProtecPo
     */
    def getCookie: Future[WSCookie] = {
      if (isExpired) loadSessionCookie
      else Future.successful(this.cookie.get)
    }

  }

  def searchGloveMaterials(substances: List[(String, Double)], water: Double, impurities: Double) = {
    val substanceSeparator = "!!!"
    val listSeparator = "%25%25%25"

    val substancesString = substances.map(pair => pair._1 + substanceSeparator + pair._2).mkString(listSeparator)
    val url = baseUrl + s"servlet/RechercheWEB?typeRecherche=RechercheMateriauxDepuisCompo&motCle=$substancesString&indetermine=SAI$substanceSeparator$water${listSeparator}SOI$substanceSeparator$impurities"

    SessionCookie.getCookie flatMap { cookie =>
      httpClient.url(url)
        .withCookies(cookie)
        .get()
        .map(res => Jsoup.parse(res.body))
        .map { html =>

          // Get all tables
          html.getElementsByTag("table").asScala
            .flatMap(table => {
              val rows = table.getElementsByTag("tr").asScala

              // The first one should be the head.
              if (rows.nonEmpty) {
                val top = rows.head.text()

                val lines = rows.tail.map(tr => tr.child(0).text())

                val resistance =
                  if (top.startsWith("Strong")) Resistance.Strong
                  else if (top.startsWith("Medium")) Resistance.Medium
                  else if (top.startsWith("Low")) Resistance.Low
                  else null

                if (resistance != null) {
                  lines.map(material => (resistance, material))
                } else Nil
              } else Nil
            })
            .toList
        }
    }
  }

  def searchSolvents(keyword: String): Future[List[Substance]] = {
    val maxResults = 100
    val url = baseUrl + s"servlet/RechercheWEB?typeRecherche=RechercheSolvantsDepuisMotCle&motCle=$keyword&nbResultatAffiche=$maxResults"

    SessionCookie.getCookie flatMap { cookie =>
      httpClient.url(url)
        .withCookies(cookie)
        .get()
        .map(res => Jsoup.parse(res.body))
        .map { html =>

          html.getElementsByTag("tr").asScala
            // Ignore potential warning rows (they have only one column)
            .filter(row => row.childrenSize() >= 4)
            // Keep only thw first two columns: subst name, and cas number
            .map(row =>
              Substance(
                name = row.child(0).text(),
                casNumber = row.child(1).text()
              ))
            .toList
        }
    }
  }

  def getAllSolvents(): Future[List[Substance]] = {
    def getSolvents(family: Int) = {
      val url = baseUrl + s"servlet/RechercheWEB?typeRecherche=RechercheSolvantsDepuisFamille&motCle=$family&affichage=0"


      println("--------------------------")
      println(s"Starting search $family")

      SessionCookie.getCookie flatMap { cookie =>
        httpClient.url(url)
          .withCookies(cookie)
          .get()
          // Need to fix the HTML for JSoup to see the <tr> tags
          .map(res => Jsoup.parse("<table>" + res.body + "</table>"))
          .map { html =>

            println(s"Finished research $family")

            val list = html.getElementsByTag("tr").asScala
              .filter(row => row.childrenSize() >= 2 && row.child(0).tagName() == "td")
              // Keep only thw first two columns: subst name, and cas number
              .map(row =>
                Substance(
                  name = row.child(0).text(),
                  casNumber = row.child(1).text()
                ))
              .toList

            println("Extracted " + list.size + " substances")
            list
          }
      }
    }

    // We want to make the requests sequential to avoid killing ProtecPro
    def next(i: Int, result: List[Substance] = Nil): Future[List[Substance]] = {
      if (i >= 20) Future.successful(result)
      else getSolvents(i).flatMap(res => next(i + 1, res ::: result))
    }

    next(1)
      .map(lst => {
        println("Finished loading all substances.")
        println(" -> Found " + lst.size + " substances")
        lst
      })
  }

}
