import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LandingComponent} from './landing/landing.component';

const routes: Routes = [
  {path: '', component: LandingComponent},
  {
    path: 'whales',
    loadChildren: () => import('./whales/whales.module').then(m => m.WhalesModule)
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
