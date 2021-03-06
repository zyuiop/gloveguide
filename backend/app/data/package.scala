import java.sql.{PreparedStatement, Types}

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
    val Butyl, Fluoroelastomer, Latex, Neoprene, Nitrile, Vinyl, PVC, PVA = Value
  }

  implicit val SubstanceFormat: Format[Substance] = Json.format[Substance]
  implicit val SubstanceParameterList: ToParameterList[Substance] = Macro.toParameters[Substance]()
  val SubstanceColumnNaming: ColumnNaming = n => "substance_" + ColumnNaming.SnakeCase(n)
  implicit val SubstanceRowParser: RowParser[Substance] = Macro.namedParser[Substance](SubstanceColumnNaming)

  implicit val RatingFormat: Format[Rating.Value] = Json.formatEnum(Rating)
  implicit val RatingColumn: Column[Option[Rating.Value]] = Column.columnToOption[String].map(s => s.map(str => Rating.withName(str)))
  implicit val OptRatingColumn: Column[Rating.Value] = Column.columnToString.map(s => Rating.withName(s))
  implicit val RatingStatement: ToStatement[Rating.Value] = (s: PreparedStatement, index: Int, v: Rating.Value) => s.setString(index, v.toString)
  implicit val OptRatingStatement: ToStatement[Option[Rating.Value]] = (s: PreparedStatement, index: Int, v: Option[Rating.Value]) => v match {
    case Some(str) => s.setString(index, str.toString)
    case None => s.setNull(index, Types.VARCHAR)
  }

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
                                  length: Int, thickness: Option[BigDecimal], standardType: String, standardResistance: String,
                                  aql: Option[BigDecimal],
                                  powdered: Option[Boolean],
                                  fingerTextured: Option[Boolean],
                                  vulcanizationAgent: Option[String]
                                )

  case class GloveRanking(recommendations: String, ranking: Int, rankingCategory: Rating.Value)

  case class GloveRatings(easeToWear: Rating.Value, easeToRemove: Rating.Value,
                          glassHandling: Set[GlassHandling],
                          tractionResistance: Set[GlovesTractionResistance])

  case class Glove(
                    id: Int,
                    brand: String,
                    materials: Set[GloveMaterialType.Value],
                    name: String,
                    reference: String,
                    disposable: Boolean,

                    specifications: GloveSpecifications,
                    ranking: Option[GloveRanking],
                    ratings: Option[GloveRatings],

                    imageUrl: Option[String], boxImageUrl: Option[String]
                  )

  implicit val GloveSpecsFormat: Format[GloveSpecifications] = Json.format[GloveSpecifications]
  implicit val GloveRankingFormat: Format[GloveRanking] = Json.format[GloveRanking]
  implicit val GloveRatingsFormat: Format[GloveRatings] = Json.format[GloveRatings]
  implicit val GloveFormat: Format[Glove] = Json.format[Glove]


  case class GloveResistanceCell(glove: Int, min: Option[Int], max: Option[Int], remarks: Option[String])

  case class GloveResistanceRow(substance: Int, concentration: Int, data: List[GloveResistanceCell])

  implicit val GloveResistanceCellFormat: Format[GloveResistanceCell] = Json.format[GloveResistanceCell]
  implicit val GloveResistanceRowFormat: Format[GloveResistanceRow] = Json.format[GloveResistanceRow]

}
