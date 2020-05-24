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

import {SolutionCompositorComponent} from './components/solutions/solution-compositor/solution-compositor.component';
import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {DisplayGloveComponent} from './components/display-glove/display-glove.component';
import {DisplaySubstanceComponent} from './components/display-substance/display-substance.component';
import {HomeComponent} from './components/home/home.component';
import {InsertionFormComponent} from './components/insertion-form/insertion-form.component';
import {GlovesComponent} from './components/gloves/gloves.component';
import {CreateGloveComponent} from './components/create-glove/create-glove.component';
import {AdminCanActivate} from './services/admin-can-activate.service';
import {AdminHomeComponent} from './components/admin-home/admin-home.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'solution', component: SolutionCompositorComponent},
  {path: 'gloves', component: GlovesComponent},
  {path: 'gloves/create', component: CreateGloveComponent, canActivate: [AdminCanActivate]},
  {path: 'gloves/:glove', component: DisplayGloveComponent},
  {path: 'substances/:casNumber', component: DisplaySubstanceComponent},

  {path: 'admin', component: AdminHomeComponent, canActivate: [AdminCanActivate]},
  {path: 'resistances/update', component: InsertionFormComponent, canActivate: [AdminCanActivate]},
  {path: 'gloves/:glove/update', component: CreateGloveComponent, canActivate: [AdminCanActivate]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
