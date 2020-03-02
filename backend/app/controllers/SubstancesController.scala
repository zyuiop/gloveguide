package controllers

import javax.inject._
import models.SubstancesModel
import play.api.libs.json.Json
import play.api.mvc._
import services.ProtecPoAdapter

import scala.concurrent.{ExecutionContext, Future}

/**
 * This controller handles all queries to the substances database
 */
@Singleton
class SubstancesController @Inject()(cc: ControllerComponents, pp: ProtecPoAdapter, subst: SubstancesModel)(implicit ec: ExecutionContext) extends AbstractController(cc) {

  def getAll = Action.async {
    subst.getAllSubstances.flatMap { substances =>
      if (substances.length > 100) {
        // Looks like we have a DB already, return
        Future.successful(substances)
      } else {
        println("Substances database is small (" + substances.length + " items), running a protecpo query to fill it")
        pp.getAllSolvents()
          .flatMap(subst.interceptProtecPoResult)
          .flatMap(_ => subst.getAllSubstances)
      }
    }.map(result => Ok(Json.toJson(result)))
  }

  def search(query: String) = Action.async {
    pp.searchSolvents(query)
        .flatMap(subst.interceptProtecPoResult)
        .map(substances => Ok(Json.toJson(substances)))
  }

}
