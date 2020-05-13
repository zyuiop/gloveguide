package services

import java.io.{File, InputStreamReader}
import java.nio.file.attribute.PosixFilePermissions
import java.nio.file.{Files, Paths}
import java.util.Scanner

import javax.inject.Inject
import play.api.Configuration
import play.api.libs.Files.TemporaryFile
import utils.RandomUtils


class FileHandlingService @Inject()(configuration: Configuration) {
  lazy val uploadPath = {
    val path = configuration.get[String]("uploads.localPath")
    if (path.endsWith("/")) path.dropRight(1) else path
  }

  lazy val uploadUrl = {
    val url = configuration.get[String]("uploads.remoteUrl")
    if (url.endsWith("/")) url.dropRight(1) else url
  }

  def getUrl(localPath: String) = s"$uploadUrl/$localPath"

  def getMime(file: TemporaryFile): String = {
    val mime = Files.probeContentType(file.path)

    if (mime == null) {
      val p = new ProcessBuilder("/usr/bin/file", "-b", "--mime-type", file.path.toAbsolutePath.toString).start()
      val os = p.getInputStream
      p.waitFor()

      val reader = new Scanner(new InputStreamReader(os))
      val res = reader.nextLine()
      reader.close()
      res
    } else mime
  }

  def listFiles: List[String] = {
    val dir = new File(uploadPath)
    if (dir.exists && dir.isDirectory) {
      dir.listFiles.filter(_.isFile).map(_.getName).toList
    } else {
      Nil
    }
  }

  def saveFile(file: TemporaryFile, ext: String): String = {
    val randomId = RandomUtils.randomString(20)
    val dot = if (ext.startsWith(".")) "" else "."
    val fileName: String = randomId + dot + ext
    val path = Paths.get(s"$uploadPath/$fileName")

    if (!Files.exists(path)) Files.createDirectories(path)

    file.moveTo(path, replace = true)

    Files.setPosixFilePermissions(path, PosixFilePermissions.fromString("rw-r--r--"))

    fileName
  }
}
