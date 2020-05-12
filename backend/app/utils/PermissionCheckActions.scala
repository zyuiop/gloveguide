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

package utils

import javax.inject.Inject
import play.api.mvc.{ActionBuilder, ActionFilter, AnyContent, BodyParsers, Request, Results}

import scala.concurrent.{ExecutionContext, Future}

class PermissionCheckActions @Inject()(val parser: BodyParsers.Default, authenticator: Authenticator[_])(implicit val executionContext: ExecutionContext) extends ActionBuilder[Request, AnyContent] with ActionFilter[Request] {
  override def filter[A](request: Request[A]) = Future {
    if (!authenticator.hasValidUser(request))
      Some(Results.Forbidden)
    else
      Option.empty
  }

}
