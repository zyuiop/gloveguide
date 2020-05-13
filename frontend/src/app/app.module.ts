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

import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {SubstanceSelectorComponent} from './components/selectors/substance-selector/substance-selector.component';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatInputModule} from '@angular/material/input';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatListModule} from '@angular/material/list';
import {SolutionCompositorComponent} from './components/solutions/solution-compositor/solution-compositor.component';
import {GlovesComponent} from './components/gloves/gloves.component';
import {MatCardModule} from '@angular/material/card';
import {FlexLayoutModule} from '@angular/flex-layout';
import { RatingBadgeComponent } from './components/tools/rating-badge/rating-badge.component';
import {MatExpansionModule} from '@angular/material/expansion';
import { DisclaimerComponent } from './components/disclaimer/disclaimer.component';
import { InsertionFormComponent } from './components/insertion-form/insertion-form.component';
import { ResistancesTableComponent } from './components/resistances-table/resistances-table.component';
import {NgbPopoverModule} from '@ng-bootstrap/ng-bootstrap';
import {MatDialogModule} from '@angular/material/dialog';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import {RouterModule} from '@angular/router';
import {AppRoutingModule} from './app-routing.module';
import { DisplayGloveComponent } from './components/display-glove/display-glove.component';
import { DisplaySubstanceComponent } from './components/display-substance/display-substance.component';
import { HomeComponent } from './components/home/home.component';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { SolutionResultsComponent } from './components/solutions/solution-results/solution-results.component';
import { SolutionViewerComponent } from './components/solutions/solution-viewer/solution-viewer.component';
import { SolutionModalComponent } from './components/solutions/solution-modal/solution-modal.component';
import { CreateGloveComponent } from './components/create-glove/create-glove.component';
import { RatingSelectorComponent } from './components/selectors/rating-selector/rating-selector.component';
import {MatSelectModule} from '@angular/material/select';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { LocaleSwitcherComponent } from './components/locale-switcher/locale-switcher.component';
import { LoginComponent } from './components/login/login.component';
import { UploadsComponent } from './components/uploads/uploads.component';

@NgModule({
  declarations: [
    AppComponent,
    SubstanceSelectorComponent,
    SolutionCompositorComponent,
    GlovesComponent,
    RatingBadgeComponent,
    DisclaimerComponent,
    InsertionFormComponent,
    ResistancesTableComponent,
    SearchBarComponent,
    DisplayGloveComponent,
    DisplaySubstanceComponent,
    HomeComponent,
    SolutionResultsComponent,
    SolutionViewerComponent,
    SolutionModalComponent,
    CreateGloveComponent,
    RatingSelectorComponent,
    LocaleSwitcherComponent,
    LoginComponent,
    UploadsComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatAutocompleteModule,
    MatInputModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatListModule,
    FormsModule,
    MatCardModule,
    FlexLayoutModule,
    MatExpansionModule,
    NgbPopoverModule,
    MatDialogModule,
    RouterModule,
    AppRoutingModule,
    MatSnackBarModule,
    MatSelectModule,
    MatCheckboxModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [
    DisclaimerComponent
  ]
})
export class AppModule {
}
