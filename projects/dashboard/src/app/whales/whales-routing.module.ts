import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LandingComponent} from './landing/landing.component';
import {WhaleComponent} from './whale/whale.component';

const routes: Routes = [
  {path: '', component: LandingComponent},
  {path: ':whaleId', component: WhaleComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WhalesRoutingModule { }
