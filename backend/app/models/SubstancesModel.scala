package models

import anorm._
import data._
import javax.inject._

import scala.concurrent.{ExecutionContext, Future}

@Singleton
class SubstancesModel @Inject()(dbApi: play.api.db.DBApi)(implicit ec: ExecutionContext) {

  private val db = dbApi database "default"

  def createSubstance(substance: Substance) = Future(db.withConnection { implicit conn =>
    insertOne("substances", substance, ignore = true, columnNaming = SubstanceColumnNaming)
  })

  def createSubstances(substances: Iterable[Substance]) = Future(db.withConnection { implicit conn =>
    insertMultiple("substances", substances, ignore = true, columnNaming = SubstanceColumnNaming)
  })

  def getAllSubstances: Future[List[Substance]] = Future(db.withConnection { implicit conn =>
    SQL("SELECT * FROM substances")
      .as(SubstanceRowParser.*)
  })

  def interceptProtecPoResult[T <: Iterable[Substance]](result: T): Future[T] = {
    // Insert the result then return it back
    createSubstances(result).map(_ => result)
  }

  def getSubstanceByCasNumber(casNumber: String): Future[Option[Substance]] = Future(db.withConnection { implicit conn =>
    SQL("SELECT * FROM substances WHERE substance_cas_number = {casNumber}")
      .on("casNumber" -> casNumber)
      .as(SubstanceRowParser.singleOpt)
  })


}
