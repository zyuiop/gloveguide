import sbt.Keys.{libraryDependencies, resolvers}

lazy val root = (project in file("."))
  .enablePlugins(PlayScala, JDebPackaging, SystemdPlugin, JavaServerAppPackaging)
  .settings(
    name := "gloveguide",
    version := "1.0",
    scalaVersion := "2.13.1",
    libraryDependencies ++= Seq(jdbc, evolutions, ehcache, ws, specs2 % Test, guice),

    maintainer in Linux := "Louis Vialar <louis.vialar@gmail.com>",

    javaOptions in Universal ++= Seq(
      // JVM memory tuning
      "-J-Xmx1024m",
      "-J-Xms512m",

      // Since play uses separate pidfile we have to provide it with a proper path
      // name of the pid file must be play.pid
      s"-Dpidfile.path=/var/run/${packageName.value}/play.pid",
      "-DapplyEvolutions.default=true"
    ),

    packageSummary in Linux := "GloveGuide project",

    packageDescription := "GloveGuide project",

    libraryDependencies += "org.playframework.anorm" %% "anorm" % "2.6.4",
    libraryDependencies += "mysql" % "mysql-connector-java" % "5.1.46",
    libraryDependencies += "org.jsoup" % "jsoup" % "1.12.2",

    resolvers += "scalaz-bintray" at "https://dl.bintray.com/scalaz/releases",

    resolvers += "Akka Snapshot Repository" at "https://repo.akka.io/snapshots/",
    scalacOptions ++= Seq(
      "-feature",
      "-deprecation"
    )
  )
