import {SolutionCompositorComponent} from './components/solutions/solution-compositor/solution-compositor.component';
import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {DisplayGloveComponent} from './components/display-glove/display-glove.component';
import {DisplaySubstanceComponent} from './components/display-substance/display-substance.component';
import {HomeComponent} from './components/home/home.component';
import {InsertionFormComponent} from './components/insertion-form/insertion-form.component';
import {GlovesComponent} from './components/gloves/gloves.component';
import {CreateGloveComponent} from './components/create-glove/create-glove.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'solution', component: SolutionCompositorComponent},
  {path: 'gloves', component: GlovesComponent},
  {path: 'resistances/update', component: InsertionFormComponent},
  {path: 'gloves/create', component: CreateGloveComponent},
  {path: 'gloves/:glove/update', component: CreateGloveComponent},
  {path: 'gloves/:glove', component: DisplayGloveComponent},
  {path: 'substances/:casNumber', component: DisplaySubstanceComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
