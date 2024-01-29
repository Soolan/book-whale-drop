import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {PageNotFoundComponent} from '@shared-components/page-not-found/page-not-found.component';
import {LandingComponent} from './landing/landing.component';
import {MapComponent} from './map/map.component';

const routes: Routes = [
  {path: '', component: LandingComponent},
  {path: 'map', component: MapComponent},
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
