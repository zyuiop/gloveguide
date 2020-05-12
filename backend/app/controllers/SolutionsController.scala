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

import data.Substance
import javax.inject._
import models.SubstancesModel
import play.api.libs.json.{Json, OFormat}
import play.api.mvc._
import services.ProtecPoAdapter

import scala.concurrent.ExecutionContext

/**
 * This controller handles all queries to the substances database
 */
@Singleton
class SolutionsController @Inject()(cc: ControllerComponents, protecPo: ProtecPoAdapter, subst: SubstancesModel)(implicit ec: ExecutionContext) extends AbstractController(cc) {

  case class SubstanceWithProportion(substance: Substance, proportion: Double)

  case class Solution(substances: List[SubstanceWithProportion], water: Double, impurities: Double)

  implicit val SubstanceWithProportionFormat: OFormat[SubstanceWithProportion] = Json.format[SubstanceWithProportion]
  implicit val SolutionFormat: OFormat[Solution] = Json.format[Solution]

  def findGloves: Action[Solution] = Action.async(parse.json[Solution]) { implicit request =>
    protecPo.searchGloveMaterials(
      request.body.substances.map(subst => (subst.substance.casNumber, subst.proportion)),
      request.body.water, request.body.impurities
    )
      .map(list => list.map(elem => Json.obj("material" -> elem._2, "resistance" -> elem._1)))
      .map(list => Ok(Json.toJson(list)))
  }

}
