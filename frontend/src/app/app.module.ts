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
import {SolutionCompositorComponent} from './components/solution-compositor/solution-compositor.component';
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
    SearchBarComponent
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
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [
    DisclaimerComponent
  ]
})
export class AppModule {
}
