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
