import java.sql.Connection

import anorm.Macro.ColumnNaming
import anorm.SqlParser.scalar
import anorm.{BatchSql, NamedParameter, SQL, ToParameterList}

package object models {

  /**
   * Inserts one item in the given table and returns its id
   *
   * @param table the table in which the item shall be inserted
   * @param item  the item that shall be inserted
   * @return the id of the inserted item
   */
  def insertOne[T](table: String, item: T, upsert: Boolean = false, columnNaming: ColumnNaming = ColumnNaming.SnakeCase, excludeColumns: Set[String] = Set())(implicit parameterList: ToParameterList[T], conn: Connection): Int = {
    val params: Seq[NamedParameter] = parameterList(item);
    val names: List[String] = params.map(_.name).filterNot(excludeColumns).toList
    val colNames = names.map(columnNaming) mkString ", "
    val placeholders = names.map { n => s"{$n}" } mkString ", "
    val updateData = names.map(k => columnNaming(k) + " = {" + k + "}").mkString(", ")

    SQL("INSERT INTO " + table + "(" + colNames + ") VALUES (" + placeholders + ")" + (if (upsert) " ON DUPLICATE KEY UPDATE " + updateData else ""))
      .bind(item)
      .executeInsert(scalar[Int].singleOpt)
      .getOrElse(0)
  }
  
  /**
   * Inserts items in the given table
   *
   * @param table the table in which the items shall be inserted
   * @param items the items that shall be inserted
   * @param ignore whether to use INSERT IGNORE instead of INSERT
   */
  def insertMultiple[T](table: String, items: Iterable[T], ignore: Boolean = false, columnNaming: ColumnNaming = ColumnNaming.SnakeCase)(implicit parameterList: ToParameterList[T], conn: Connection) = {
    if (items.isEmpty) {
      Array.empty[Int]
    } else {
      val params: Seq[NamedParameter] = parameterList(items.head);
      val names: List[String] = params.map(_.name).toList
      val colNames = names.map(columnNaming) mkString ", "
      val placeholders = names.map { n => s"{$n}" } mkString ", "
      val command = if (ignore) "INSERT IGNORE" else "INSERT"

      BatchSql(s"$command INTO $table ($colNames) VALUES ($placeholders)", params, items.tail.map(parameterList).toSeq: _*)
        .execute()
    }
  }
}
