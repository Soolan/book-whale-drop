import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LandingComponent} from './landing/landing.component';
import {PageNotFoundComponent} from '../../../shared/src/lib/components/page-not-found/page-not-found.component';

const routes: Routes = [
  {path: '', component: LandingComponent},
  {
    path: 'whales',
    loadChildren: () => import('./whales/whales.module').then(m => m.WhalesModule)
  },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
