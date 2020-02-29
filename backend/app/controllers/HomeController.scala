package controllers

import javax.inject._
import play.api.libs.json.Json
import play.api.mvc._
import services.ProtectPoAdapter

import scala.concurrent.ExecutionContext

/**
 * This controller creates an `Action` to handle HTTP requests to the
 * application's home page.
 */
@Singleton
class HomeController @Inject()(cc: ControllerComponents, pp: ProtectPoAdapter)(implicit ec: ExecutionContext) extends AbstractController(cc) {

  /**
   * Create an Action to render an HTML page with a welcome message.
   * The configuration in the `routes` file means that this method
   * will be called when the application receives a `GET` request with
   * a path of `/`.
   */
  def index = Action.async {
    pp.searchGloveMaterials(List(("64-17-5", 100)), 0, 0).map(res => Ok(Json.toJson(res)))
  }

}
