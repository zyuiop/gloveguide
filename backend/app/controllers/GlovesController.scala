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
class GlovesController @Inject()(cc: ControllerComponents, gloves: GlovesModel)(implicit ec: ExecutionContext) extends AbstractController(cc) {

  def getAll: Action[AnyContent] = Action.async { implicit request =>
    gloves.getAllGloves.map(res => Ok(Json.toJson(res)))
  }

  def getByType(materialType: String): Action[AnyContent] = Action.async { implicit request =>
    GloveMaterialType.values.find(_.toString == materialType) match {
      case Some(tpe) => gloves.getGlovesByType(tpe).map(res => Ok(Json.toJson(res)))
      case None => Future.successful(NotFound)
    }
  }

}
