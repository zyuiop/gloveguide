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

import anorm._
import anorm.SqlParser._
import data.{GloveResistanceCell, GloveResistanceRow}
import javax.inject._

import scala.collection.immutable
import scala.concurrent.{ExecutionContext, Future}

@Singleton
class ResistancesModel @Inject()(dbApi: play.api.db.DBApi)(implicit ec: ExecutionContext) {

  private val db = dbApi database "default"

  def setResistance(dilution: Int, cell: GloveResistanceCell) =
    Future(db.withConnection(implicit c =>
      SQL"INSERT INTO gloves_resistance(glove_id, dilution_id, min_resistance, max_resistance, remarks) VALUES (${cell.glove}, $dilution, ${cell.min}, ${cell.max}, ${cell.remarks}) ON DUPLICATE KEY UPDATE min_resistance = ${cell.min}, max_resistance = ${cell.max}, remarks = ${cell.remarks}"
        .execute()
    ))

  private val resistanceParser: ResultSetParser[immutable.Iterable[GloveResistanceRow]] =
    ((int("substance_id") ~ int("concentration")) ~ (int("glove_id") ~
      int("min_resistance").? ~ int("max_resistance").? ~ str("remarks").?)).*
    .map(lst => lst.groupMap(_._1) {
      case (_) ~ (glove ~ min ~ max ~ remarks) => GloveResistanceCell(glove, min, max, remarks)
    }.map {
      case ((substId ~ concentration), list) => GloveResistanceRow(substId, concentration, list)
    })

  def getResistances =
    Future(db.withConnection(implicit c =>
      SQL"SELECT * FROM gloves_resistance JOIN dilutions d on gloves_resistance.dilution_id = d.dilution_id ORDER BY d.dilution_id"
        .as(resistanceParser)
    ))

  def getResistancesForGlove(glove: Int) =
    Future(db.withConnection(implicit c =>
      SQL"SELECT * FROM gloves_resistance JOIN dilutions d on gloves_resistance.dilution_id = d.dilution_id WHERE glove_id = $glove GROUP BY d.dilution_id"
        .as(resistanceParser)
    ))

  def getResistancesForSubstance(substance: Int) =
    Future(db.withConnection(implicit c =>
      SQL"SELECT * FROM gloves_resistance JOIN dilutions d on gloves_resistance.dilution_id = d.dilution_id WHERE substance_id = $substance GROUP BY d.dilution_id"
        .as(resistanceParser)
    ))

}
