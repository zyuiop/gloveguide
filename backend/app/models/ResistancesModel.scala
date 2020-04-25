package models

import anorm.Macro.ColumnNaming
import anorm.SqlParser._
import anorm._
import data._
import javax.inject._

import scala.collection.immutable
import scala.concurrent.{ExecutionContext, Future}

@Singleton
class ResistancesModel @Inject()(dbApi: play.api.db.DBApi)(implicit ec: ExecutionContext) {

  private val db = dbApi database "default"

  private val glovesQuery =
    "SELECT * FROM gloves JOIN gloves_manufacturers gm on gloves.glove_manufacturer_id = gm.gloves_manufacturer_id " +
      "JOIN gloves_materials g on gloves.glove_material_id = g.gloves_material_id " +
      "JOIN gloves_materials_types gmt on g.gloves_material_id = gmt.gloves_material_id " +
      "JOIN gloves_glass_handling ggh on gloves.glove_id = ggh.glove_id " +
      "JOIN gloves_traction_resistance gtr on gloves.glove_id = gtr.glove_id"


  case class DatabaseGlove(name: String, reference: String, length: Int, thickness: BigDecimal, standardType: String,
                           standardResistance: String, standardAql: BigDecimal, easeToWear: Rating.Value, easeToRemove: Rating.Value,
                           recommendations: String, ranking: Int, rankingCategory: Rating.Value)

  implicit val GloveParameterList: ToParameterList[DatabaseGlove] = Macro.toParameters[DatabaseGlove]()
  implicit val GloveRowParser: RowParser[DatabaseGlove] = Macro.namedParser[DatabaseGlove]((field: String) => "glove_" + ColumnNaming.SnakeCase(field))

  private val glovesParser: ResultSetParser[immutable.List[Glove]] =
    (GloveRowParser ~ data.GloveManufacturerRowParser ~
      (str("gloves_material_name") ~ str("gloves_material_type").map(GloveMaterialType.withName)) ~
      (str("humidifier") ~ GlassHandlingRowParser) ~
      (str("gloves_traction_resistance_humidifier") ~ str("traction_resistance").map(Rating.withName))
      ).*.map { list =>
      // We need to join the list!
      list.map {
        case glove ~ manufacturer ~ (matName ~ matType) ~ (humidifier ~ glassHandling) ~ (tractionHumidifier ~ tractionResistance) =>
          ((glove, manufacturer, matName), (matType, (humidifier, glassHandling), (tractionHumidifier, tractionResistance)))
      }
        .groupMap(_._1)(_._2)
        .map {
          case ((glove, manufacturer, material), props) =>
            val materialTypes: Set[data.GloveMaterialType.Value] = props.map(_._1).toSet
            val glassHandling: Map[String, data.GlassHandling] = props.map(_._2).toMap
            val tractionResistance: Map[String, data.Rating.Value] = props.map(_._3).toMap

            Glove(manufacturer, GloveMaterial(material, materialTypes),
              glove.name, glove.reference, glove.length, glove.thickness, glove.standardType, glove.standardResistance,
              glove.standardAql, easeToWear = glove.easeToWear, easeToRemove = glove.easeToRemove, glove.recommendations,
              glove.ranking, glove.rankingCategory, glassHandling, tractionResistance)
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

  def setResistance(dilution: Int, glove: Int, min: Int, max: Int, remarks: Option[String]) =
    Future(db.withConnection(implicit c =>
      SQL"INSERT INTO gloves_resistance(glove_id, dilution_id, min_resistance, max_resistance, remarks) VALUES ($glove, $dilution, $min, $max, $remarks) ON DUPLICATE KEY UPDATE min_resistance = $min, max_resistance = $max, remarks = $remarks"
        .execute()
    ))
}
