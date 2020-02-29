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
 * This service queries ProtectPo to extract its information
 */
@Singleton
class ProtectPoAdapter @Inject()(httpClient: WSClient, config: Configuration)(implicit ec: ExecutionContext) {
  lazy val baseUrl: String = {
    val secure = config.get[Boolean]("protectpo.secure")
    val domain = config.get[String]("protectpo.domain")

    (if (secure) "https" else "http") + "://" + domain + "/"
  }

  object SessionCookie {
    private var cookie: Option[WSCookie] = None
    private var lastRefresh: Long = 0L

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

  // There is an opportunity to download the whole protecpo database using https://protecpo.inrs.fr/ProtecPo/jsp/RechercheParFamille.jsp?langue=EN
  // Not sure it is moral nor legal

}
