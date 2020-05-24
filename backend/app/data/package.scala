import java.sql.PreparedStatement

import anorm.Macro.ColumnNaming
import anorm.SqlParser._
import anorm.{Column, Macro, RowParser, ToParameterList, ToStatement, _}

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

import play.api.libs.json.{Format, Json}

package object data {

  case class Substance(id: Option[Int], name: String, casNumber: String)

  object Rating extends Enumeration {
    type Rating = Value
    val Poor, Passable, Medium, Good = Value
  }

  object GloveMaterialType extends Enumeration {
    type Rating = Value
    val Butyl, Fluoroelastomer, Latex, Neoprene, Nitrile = Value
  }

  implicit val SubstanceFormat: Format[Substance] = Json.format[Substance]
  implicit val SubstanceParameterList: ToParameterList[Substance] = Macro.toParameters[Substance]()
  val SubstanceColumnNaming: ColumnNaming = n => "substance_" + ColumnNaming.SnakeCase(n)
  implicit val SubstanceRowParser: RowParser[Substance] = Macro.namedParser[Substance](SubstanceColumnNaming)

  implicit val RatingFormat: Format[Rating.Value] = Json.formatEnum(Rating)
  implicit val RatingColumn: Column[Rating.Value] = Column.columnToString.map(s => Rating.withName(s))
  implicit val RatingStatement: ToStatement[Rating.Value] = (s: PreparedStatement, index: Int, v: Rating.Value) => s.setString(index, v.toString)

  implicit val GloveMaterialTypeFormat: Format[GloveMaterialType.Value] = Json.formatEnum(GloveMaterialType)
  implicit val GloveMaterialTypeColumn: Column[GloveMaterialType.Value] = Column.columnToString.map(s => GloveMaterialType.withName(s))
  implicit val GloveMaterialTypeStatement: ToStatement[GloveMaterialType.Value] = (s: PreparedStatement, index: Int, v: GloveMaterialType.Value) => s.setString(index, v.toString)

  case class GlassHandling(humidifier: String, glassHandling: Rating.Value, leavesMarks: Boolean)

  implicit val GlassHandlingFormat: Format[GlassHandling] = Json.format[GlassHandling]
  implicit val GlassHandlingParameterList: ToParameterList[GlassHandling] = Macro.toParameters[GlassHandling]()
  implicit val GlassHandlingRowParser: RowParser[GlassHandling] = Macro.namedParser[GlassHandling](ColumnNaming.SnakeCase)

  case class GlovesTractionResistance(humidifier: String, tractionResistance: Rating.Value)

  implicit val GlovesTractionResistanceFormat: Format[GlovesTractionResistance] = Json.format[GlovesTractionResistance]
  implicit val GlovesTractionResistanceRowParser: RowParser[GlovesTractionResistance] =
    (str("gloves_traction_resistance_humidifier") ~ str("traction_resistance")).map({ case humidifier ~ resistance => GlovesTractionResistance(humidifier, Rating.withName(resistance)) })
  implicit val GlovesTractionResistanceParameterList: ToParameterList[GlovesTractionResistance] = Macro.toParameters[GlovesTractionResistance]()

  case class GloveSpecifications(
                                  length: Int, thickness: BigDecimal, standardType: String, standardResistance: String,
                                  aql: BigDecimal, powdered: Boolean, fingerTextured: Boolean,
                                  vulcanizationAgent: Option[String], disposable: Boolean
                                )

  // There is a limit of 22 fields for a method in Scala 2.13
  // We therefore need to split this case class in two
  case class Glove(
                    id: Int,
                    brand: String,
                    materials: Set[GloveMaterialType.Value],
                    name: String, reference: String,
                    specifications: GloveSpecifications,
                    easeToWear: Rating.Value, easeToRemove: Rating.Value,
                    recommendations: String, ranking: Int, rankingCategory: Rating.Value,

                    glassHandling: Set[GlassHandling],
                    tractionResistance: Set[GlovesTractionResistance],

                    imageUrl: Option[String], boxImageUrl: Option[String]
                  )

  implicit val GloveSpecsFormat: Format[GloveSpecifications] = Json.format[GloveSpecifications]
  implicit val GloveFormat: Format[Glove] = Json.format[Glove]


  case class GloveResistanceCell(glove: Int, min: Option[Int], max: Option[Int], remarks: Option[String])

  case class GloveResistanceRow(substance: Int, concentration: Int, data: List[GloveResistanceCell])

  implicit val GloveResistanceCellFormat: Format[GloveResistanceCell] = Json.format[GloveResistanceCell]
  implicit val GloveResistanceRowFormat: Format[GloveResistanceRow] = Json.format[GloveResistanceRow]

}
