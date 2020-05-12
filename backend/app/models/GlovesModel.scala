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

package models

import anorm.Macro.ColumnNaming
import anorm.SqlParser._
import anorm._
import data._
import javax.inject._

import scala.collection.immutable
import scala.concurrent.{ExecutionContext, Future}

@Singleton
class GlovesModel @Inject()(dbApi: play.api.db.DBApi)(implicit ec: ExecutionContext) {

  private val db = dbApi database "default"

  private val glovesQuery =
    "SELECT * FROM gloves " +
      "JOIN gloves_materials g on gloves.glove_material_id = g.gloves_material_id " +
      "JOIN gloves_materials_types gmt on g.gloves_material_id = gmt.gloves_material_id " +
      "JOIN gloves_glass_handling ggh on gloves.glove_id = ggh.glove_id " +
      "JOIN gloves_traction_resistance gtr on gloves.glove_id = gtr.glove_id"


  case class DatabaseGlove(id: Int, brand: String, name: String, reference: String, length: Int, thickness: BigDecimal, standardType: String,
                           standardResistance: String, standardAql: BigDecimal, easeToWear: Rating.Value, easeToRemove: Rating.Value,
                           recommendations: String, ranking: Int, rankingCategory: Rating.Value,
                           powdered: Boolean, fingerTextured: Boolean, vulcanizationAgent: Option[String])

  implicit val GloveParameterList: ToParameterList[DatabaseGlove] = Macro.toParameters[DatabaseGlove]()
  implicit val GloveRowParser: RowParser[DatabaseGlove] = Macro.namedParser[DatabaseGlove]((field: String) => "glove_" + ColumnNaming.SnakeCase(field))

  private val glovesParser: ResultSetParser[immutable.List[Glove]] =
    (GloveRowParser ~
      (str("gloves_material_name") ~ str("gloves_material_type").map(GloveMaterialType.withName)) ~
       GlassHandlingRowParser ~ GlovesTractionResistanceRowParser
      ).*.map { list =>
      // We need to join the list!
      list.map {
        case glove ~ (matName ~ matType) ~ (glassHandling) ~ (tractionResistance) =>
          ((glove, matName), (matType, glassHandling, tractionResistance))
      }
        .groupMap(_._1)(_._2)
        .map {
          case ((glove, material), props) =>
            val materialTypes: Set[data.GloveMaterialType.Value] = props.map(_._1).toSet
            val glassHandling = props.map(_._2).toSet
            val tractionResistance = props.map(_._3).toSet

            Glove(glove.id, glove.brand, GloveMaterial(material, materialTypes),
              glove.name, glove.reference, glove.length, glove.thickness, glove.standardType, glove.standardResistance,
              glove.standardAql, easeToWear = glove.easeToWear, easeToRemove = glove.easeToRemove, glove.recommendations,
              glove.ranking, glove.rankingCategory, glassHandling, tractionResistance, glove.powdered, glove.fingerTextured, glove.vulcanizationAgent)
        }.toList.sortBy(_.ranking)
    }

  def getAllGloves: Future[List[Glove]] =
    Future(db.withConnection(implicit c => SQL(glovesQuery).as(glovesParser)))

  def getGlovesByType(material: GloveMaterialType.Value): Future[List[Glove]] =
    Future(db.withConnection(implicit c =>
      SQL(glovesQuery + " WHERE gloves_material_type = {type}")
        .on("type" -> material)
        .as(glovesParser))
    )
}
