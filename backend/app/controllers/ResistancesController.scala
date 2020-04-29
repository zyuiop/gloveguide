package controllers

import data._
import javax.inject._
import models.{DilutionsModel, ResistancesModel}
import play.api.libs.json.Json
import play.api.mvc._

import scala.concurrent.{ExecutionContext, Future}

/**
 * This controller handles all queries to the substances database
 */
@Singleton
class ResistancesController @Inject()(cc: ControllerComponents, dilutions: DilutionsModel, resistances: ResistancesModel)(implicit ec: ExecutionContext) extends AbstractController(cc) {

  def setResistances: Action[List[GloveResistanceRow]] = Action.async(parse.json[List[GloveResistanceRow]]) { req =>
    val futures = req.body.map { row =>
      dilutions.getOrCreateDilution(row.substance, row.concentration).flatMap { dilutionId => {
        Future.sequence(row.data.map(cell => resistances.setResistance(dilutionId, cell)))
      }
      }
    }

    Future.sequence(futures).map(res => Ok)
  }

  def getResistances: Action[AnyContent] =
    Action.async(r => resistances.getResistances.map(r => Ok(Json.toJson(r))))

  def getResistancesForGlove(glove: Int): Action[AnyContent] =
    Action.async(r => resistances.getResistancesForGlove(glove).map(r => Ok(Json.toJson(r))))

  def getResistancesForSubstance(substance: Int): Action[AnyContent] =
    Action.async(r => resistances.getResistancesForSubstance(substance).map(r => Ok(Json.toJson(r))))
}
