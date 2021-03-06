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

import java.sql.Connection

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
    "SELECT gloves.*, gmt.glove_material_type, ggh.humidifier, ggh.glass_handling, ggh.leaves_marks, gtr.gloves_traction_resistance_humidifier, gtr.traction_resistance FROM gloves " +
      "JOIN glove_material_types gmt on gloves.glove_id = gmt.glove_id " +
      "LEFT JOIN gloves_glass_handling ggh on gloves.glove_id = ggh.glove_id " +
      "LEFT JOIN gloves_traction_resistance gtr on gloves.glove_id = gtr.glove_id"

  case class DatabaseGlove(id: Option[Int], brand: String, name: String, reference: String, length: Int, thickness: Option[BigDecimal], standardType: String,
                           standardResistance: String, standardAql: Option[BigDecimal], easeToWear: Option[Rating.Value], easeToRemove: Option[Rating.Value],
                           recommendations: Option[String], ranking: Option[Int], rankingCategory: Option[Rating.Value],
                           powdered: Option[Boolean], fingerTextured: Option[Boolean], vulcanizationAgent: Option[String],
                           imageUrl: Option[String], boxImageUrl: Option[String], disposable: Boolean)

  private def toDatabaseGlove(glove: Glove): DatabaseGlove = {
    DatabaseGlove(
      id = (if (glove.id != 0) Some(glove.id) else None),
      glove.brand, glove.name, glove.reference, glove.specifications.length, glove.specifications.thickness, glove.specifications.standardType, glove.specifications.standardResistance,
      glove.specifications.aql, glove.ratings.map(_.easeToWear), glove.ratings.map(_.easeToRemove), glove.ranking.map(_.recommendations), glove.ranking.map(_.ranking), glove.ranking.map(_.rankingCategory),
      glove.specifications.powdered, glove.specifications.fingerTextured, glove.specifications.vulcanizationAgent,
      glove.imageUrl, glove.boxImageUrl, glove.disposable
    )
  }


  implicit val GloveParameterList: ToParameterList[DatabaseGlove] = Macro.toParameters[DatabaseGlove]()
  implicit val GloveRowParser: RowParser[DatabaseGlove] = Macro.namedParser[DatabaseGlove]((field: String) => "glove_" + ColumnNaming.SnakeCase(field))

  private val glovesParser: ResultSetParser[immutable.List[Glove]] =
    (GloveRowParser ~
      str("glove_material_type").map(GloveMaterialType.withName) ~
      GlassHandlingRowParser.? ~ GlovesTractionResistanceRowParser.?
      ).*.map { list =>
      // We need to join the list!
      list.map {
        case glove ~ (matType) ~ (glassHandling) ~ (tractionResistance) =>
          ((glove), (matType, glassHandling, tractionResistance))
      }
        .groupMap(_._1)(_._2)
        .map {
          case ((glove), props) =>
            val materialTypes: Set[data.GloveMaterialType.Value] = props.map(_._1).toSet
            val glassHandling = props.flatMap(_._2).toSet
            val tractionResistance = props.flatMap(_._3).toSet

            Glove(glove.id.get, glove.brand, materialTypes,
              glove.name, glove.reference, glove.disposable,
              GloveSpecifications(glove.length, glove.thickness, glove.standardType, glove.standardResistance,
                glove.standardAql, glove.powdered, glove.fingerTextured,
                glove.vulcanizationAgent),
              if (!glove.disposable) None else Some(GloveRanking(glove.recommendations.get, glove.ranking.get, glove.rankingCategory.get)),
              if (!glove.disposable) None else Some(GloveRatings(glove.easeToWear.get, glove.easeToRemove.get, glassHandling, tractionResistance)),
              glove.imageUrl, glove.boxImageUrl)
        }.toList.sortBy(_.ranking.map(_.ranking).getOrElse(Int.MaxValue))
    }

  def getAllGloves: Future[List[Glove]] =
    Future(db.withConnection(implicit c => SQL(glovesQuery).as(glovesParser)))

  def getGloveById(id: Int): Future[Option[Glove]] =
    Future(db.withConnection(implicit c =>
      SQL(glovesQuery + " WHERE gloves.glove_id = {id}")
        .on("id" -> id)
        .as(glovesParser)
        .headOption))

  def getGlovesByType(material: GloveMaterialType.Value): Future[List[Glove]] =
    Future(db.withConnection(implicit c =>
      SQL(glovesQuery + " WHERE gloves_material_type = {type}")
        .on("type" -> material)
        .as(glovesParser))
    )

  def createGlove(glove: Glove): Future[Glove] = Future(db.withConnection { implicit c =>
    // DBGlove
    val dbGlove = toDatabaseGlove(glove)
    val id = insertOne("gloves", dbGlove, columnNaming = (field: String) => "glove_" + ColumnNaming.SnakeCase(field))

    insertGloveDetails(glove, id)

    glove.copy(id = id)
  })

  private def insertGloveDetails(glove: Glove, id: Int)(implicit conn: Connection): Unit = {
    for (t <- glove.materials)
      SQL("INSERT INTO glove_material_types(glove_id, glove_material_type) VALUES ({gid}, {gmt})")
        .on("gid" -> id, "gmt" -> t)
        .executeUpdate()

    if (glove.ratings.nonEmpty) {
      for (gh <- glove.ratings.get.glassHandling)
        SQL("INSERT INTO gloves_glass_handling(glove_id, humidifier, glass_handling, leaves_marks) VALUES ({gid}, {humidifier}, {gh}, {lm})")
          .on("gid" -> id, "humidifier" -> gh.humidifier, "gh" -> gh.glassHandling, "lm" -> gh.leavesMarks)
          .executeUpdate()

      for (tr <- glove.ratings.get.tractionResistance)
        SQL("INSERT INTO gloves_traction_resistance(glove_id, gloves_traction_resistance_humidifier, traction_resistance) VALUES ({gid}, {humidifier}, {tr})")
          .on("gid" -> id, "humidifier" -> tr.humidifier, "tr" -> tr.tractionResistance)
          .executeUpdate()
    }
  }

  def deleteGlove(glove: Int): Future[Unit] = Future(db.withConnection { implicit c =>
    SQL("DELETE FROM glove_material_types WHERE glove_id = {gid}").on("gid" -> glove).execute()
    SQL("DELETE FROM gloves_glass_handling WHERE glove_id = {gid}").on("gid" -> glove).execute()
    SQL("DELETE FROM gloves_traction_resistance WHERE glove_id = {gid}").on("gid" -> glove).execute()
    SQL("DELETE FROM gloves WHERE glove_id = {gid}").on("gid" -> glove).execute()
  })

  def updateGlove(glove: Glove): Future[Unit] = Future(db.withConnection { implicit c =>
    val dbGlove = toDatabaseGlove(glove)
    updateOne("gloves", dbGlove, columnNaming = (field: String) => "glove_" + ColumnNaming.SnakeCase(field), Set("id"))

    // Delete all
    SQL("DELETE FROM glove_material_types WHERE glove_id = {gid}").on("gid" -> glove.id).execute()
    SQL("DELETE FROM gloves_glass_handling WHERE glove_id = {gid}").on("gid" -> glove.id).execute()
    SQL("DELETE FROM gloves_traction_resistance WHERE glove_id = {gid}").on("gid" -> glove.id).execute()

    insertGloveDetails(glove, glove.id)
  })

}
