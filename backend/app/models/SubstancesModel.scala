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
import data._
import javax.inject._

import scala.concurrent.{ExecutionContext, Future}

@Singleton
class SubstancesModel @Inject()(dbApi: play.api.db.DBApi)(implicit ec: ExecutionContext) {

  private val db = dbApi database "default"

  def createSubstance(substance: Substance) = Future(db.withConnection { implicit conn =>
    insertOne("substances", substance, upsert = true, columnNaming = SubstanceColumnNaming, excludeColumns = Set("id"))
  })

  def createSubstances(substances: Iterable[Substance]) = Future(db.withConnection { implicit conn =>
    substances.map {
      substance =>
        val id = insertOne("substances", substance, upsert = true, columnNaming = SubstanceColumnNaming, excludeColumns = Set("id"))
        substance.copy(id = Some(id))
    }
  })

  def batchCreateSubstances(substances: Iterable[Substance]) = Future(db.withConnection { implicit conn =>
    insertMultiple("substances", substances, ignore = true, columnNaming = SubstanceColumnNaming)

    true
  })

  def getAllSubstances: Future[List[Substance]] = Future(db.withConnection { implicit conn =>
    SQL("SELECT * FROM substances")
      .as(SubstanceRowParser.*)
  })

  def interceptProtecPoResult(result: Iterable[Substance]): Future[Iterable[Substance]] = {
    // Insert the result then return it back
    createSubstances(result)
  }

  def getSubstanceByCasNumber(casNumber: String): Future[Option[Substance]] = Future(db.withConnection { implicit conn =>
    SQL("SELECT * FROM substances WHERE substance_cas_number = {casNumber}")
      .on("casNumber" -> casNumber)
      .as(SubstanceRowParser.singleOpt)
  })


}
