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

import data._
import javax.inject._
import models.{DilutionsModel, ResistancesModel}
import play.api.libs.json.Json
import play.api.mvc._
import utils.PermissionCheckActions

import scala.concurrent.{ExecutionContext, Future}

/**
 * This controller handles all queries to the substances database
 */
@Singleton
class ResistancesController @Inject()(cc: ControllerComponents, dilutions: DilutionsModel, resistances: ResistancesModel, PermissionCheck: PermissionCheckActions)(implicit ec: ExecutionContext) extends AbstractController(cc) {

  def setResistances: Action[List[GloveResistanceRow]] = PermissionCheck.async(parse.json[List[GloveResistanceRow]]) { req =>
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

  def deleteResistance(glove: Int, substance: Int, concentration: Int) = PermissionCheck.async { req =>
    val dilution = dilutions.getDilution(substance, concentration)

    dilution.flatMap {
      case Some(dilution) => resistances.deleteResistance(glove, dilution)
      case None => Future.successful(())
    }.map(_ => Ok)
  }
}
