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

import anorm.SqlParser._
import anorm._
import javax.inject._

import scala.concurrent.{ExecutionContext, Future}

@Singleton
class DilutionsModel @Inject()(dbApi: play.api.db.DBApi)(implicit ec: ExecutionContext) {

  private val db = dbApi database "default"

  def createDilution(substId: Int, concentration: Int) =
    Future(db.withConnection(implicit c =>
      SQL"INSERT INTO dilutions(substance_id, concentration) VALUES ($substId, $concentration)"
        .executeInsert(scalar[Int].single)
    ))

  def getDilution(substId: Int, concentration: Int) =
    Future(db.withConnection(implicit c =>
      SQL"SELECT dilution_id FROM dilutions WHERE substance_id = $substId AND concentration = $concentration"
        .as(scalar[Int].singleOpt)
    ))

  def getOrCreateDilution(substId: Int, concentration: Int) =
    getDilution(substId, concentration).flatMap {
      case Some(id) => Future.successful(id)
      case None => createDilution(substId, concentration)
    }
}
