/*
 *     EPFL Gloves Guide - An application to help you choose the best gloves for a chemical work
 *     Copyright (C) 2020 - Louis Vialar & EPFL GSCP
 *
 *     This program is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU Affero General Public License as published
 *     by the Free Software Foundation, either version 3 of the License, or
 *     any later version.
 *
 *     This program is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *     GNU Affero General Public License for more details.
 *
 *     You should have received a copy of the GNU Affero General Public License
 *     along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

package controllers

import data.{Glove, GloveMaterialType}
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

  def getById(id: Int): Action[AnyContent] = Action.async { implicit request =>
    gloves.getGloveById(id).map {
      case Some(res) => Ok(Json.toJson(res))
      case None => NotFound
    }
  }

  def createGlove: Action[Glove] = Action.async(parse.json[Glove]) { implicit request =>
    val glove = request.body

    gloves.createGlove(glove).map(g => Ok(Json.toJson(g)))
  }

  def updateGlove(id: Int): Action[Glove] = Action.async(parse.json[Glove]) { implicit request =>
    val glove = request.body

    gloves.updateGlove(glove.copy(id = id)).map(_ => Ok)
  }

  def getByType(materialType: String): Action[AnyContent] = Action.async { implicit request =>
    GloveMaterialType.values.find(_.toString == materialType) match {
      case Some(tpe) => gloves.getGlovesByType(tpe).map(res => Ok(Json.toJson(res)))
      case None => Future.successful(NotFound)
    }
  }

}
