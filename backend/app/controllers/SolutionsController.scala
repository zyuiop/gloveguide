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
