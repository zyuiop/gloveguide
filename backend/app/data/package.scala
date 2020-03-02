import java.sql.PreparedStatement

import anorm.Macro.ColumnNaming
import anorm.{Column, Macro, RowParser, ToParameterList, ToStatement}
import data.Resistance.Resistance
import play.api.libs.json.{Format, Json, OFormat}

package object data {
  case class Substance(name: String, casNumber: String)

  object Resistance extends Enumeration {
    type Resistance = Value
    val Low, Medium, Strong = Value
  }

  implicit val SubstanceFormat: Format[Substance] = Json.format[Substance]
  implicit val SubstanceParameterList: ToParameterList[Substance] = Macro.toParameters[Substance]()
  val SubstanceColumnNaming: ColumnNaming = n => "substance_" + ColumnNaming.SnakeCase(n)
  implicit val SubstanceRowParser: RowParser[Substance] = Macro.namedParser[Substance](SubstanceColumnNaming)

  implicit val ResistanceFormat: Format[Resistance] = Json.formatEnum(Resistance)

  implicit def ResistanceColumn: Column[Resistance.Value] =
    Column.columnToString.map {
      case "LOW" => Resistance.Low
      case "MEDIUM" => Resistance.Medium
      case "STRONG" => Resistance.Strong
    }

  implicit val ResistanceStatement: ToStatement[Resistance.Value] = (s: PreparedStatement, index: Int, v: Resistance.Value) =>
    s.setString(index, v match {
      case Resistance.Low => "LOW"
      case Resistance.Medium => "MEDIUM"
      case Resistance.Strong => "STRONG"
    })
}
