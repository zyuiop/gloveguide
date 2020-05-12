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

  def getByCas(cas: String) = Action.async {
    subst.getSubstanceByCasNumber(cas).map {
      case Some(s) => Ok(Json.toJson(s))
      case None => NotFound
    }
  }

}
