import data.Resistance.Resistance
import play.api.libs.json.{Format, Json, OFormat}

package object data {
  case class Substance(name: String, casNumber: String)

  object Resistance extends Enumeration {
    type Resistance = Value
    val Low, Medium, Strong = Value
  }

  implicit val SubstanceFormat: Format[Substance] = Json.format[Substance]
  implicit val ResistanceFormat: Format[Resistance] = Json.formatEnum(Resistance)
}
