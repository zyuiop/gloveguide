package controllers

import data.GloveMaterialType
import javax.inject._
import models.{DilutionsModel, GlovesModel}
import play.api.libs.json.Json
import play.api.mvc._

import scala.concurrent.{ExecutionContext, Future}

/**
 * This controller handles all queries to the substances database
 */
@Singleton
class ResistancesController @Inject()(cc: ControllerComponents, gloves: GlovesModel, dilutions: DilutionsModel)(implicit ec: ExecutionContext) extends AbstractController(cc) {

  def getAll: Action[AnyContent] = Action.async { implicit request =>
    gloves.getAllGloves.map(res => Ok(Json.toJson(res)))
  }

  def getByType(materialType: String): Action[AnyContent] = Action.async { implicit request =>
    GloveMaterialType.values.find(_.toString == materialType) match {
      case Some(tpe) => gloves.getGlovesByType(tpe).map(res => Ok(Json.toJson(res)))
      case None => Future.successful(NotFound)
    }
  }

  case class GloveResistanceCell(glove: Int, min: Int, max: Int, remarks: Option[String])

  case class GloveResistanceRow(substance: Int, concentration: Int, data: List[GloveResistanceCell])

  implicit val cellFormat = Json.reads[GloveResistanceCell]
  implicit val rowFormat = Json.reads[GloveResistanceRow]

  def setResistances() = Action.async(parse.json[List[GloveResistanceRow]]) { req =>
    val futures = req.body.map { row =>
      dilutions.getOrCreateDilution(row.substance, row.concentration).flatMap { dilutionId => {
        Future.sequence(row.data.map(cell => gloves.setResistance(dilutionId, cell.glove, cell.min, cell.max, cell.remarks)))
      }}
    }

    Future.sequence(futures).map(res => Ok)
  }

}
