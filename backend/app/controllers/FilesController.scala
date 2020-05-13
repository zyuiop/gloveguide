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

package controllers

import java.nio.file.Files

import javax.inject.{Inject, Singleton}
import play.api.libs.json.Json
import play.api.mvc.{AbstractController, ControllerComponents}
import services.FileHandlingService
import utils.PermissionCheckActions

import scala.concurrent.ExecutionContext

@Singleton
class FilesController @Inject()(cc: ControllerComponents, PermissionCheck: PermissionCheckActions, files: FileHandlingService)(implicit ec: ExecutionContext) extends AbstractController(cc) {
  private val allowedTypes = Map("image/jpeg" -> ".jpg", "image/png" -> ".png", "image/bmp" -> ".bmp")
  private val maxSizeBytes = Math.pow(2, 10) * 150 // 150 kB

  def uploadFile = PermissionCheck(parse.temporaryFile) { rq =>
    val file = rq.body


    val mime = files.getMime(file)
    val size = Files.size(file.path)


    if (!allowedTypes.keySet(mime)) {
      println("Error: invalid mime " + mime + ". Returning 400.")
      (BadRequest("This file type is not allowed. Allowed types: " + allowedTypes.keySet))
    } else if (size > maxSizeBytes) {
      println("Error: invalid file size " + size + ". Returning 400.")
      (BadRequest("The file is too big. Maximal size: " + maxSizeBytes))
    } else {
      val fileName = files.saveFile(file, allowedTypes(mime))

      Ok(files.getUrl(fileName))
    }
  }

  def getFiles = PermissionCheck { rq =>
    Ok(Json.toJson(files.listFiles.map(files.getUrl)))
  }
}
