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
