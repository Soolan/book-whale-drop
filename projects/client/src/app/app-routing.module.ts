import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {PageNotFoundComponent} from '@shared-components/page-not-found/page-not-found.component';
import {AppComponent} from './app.component';

const routes: Routes = [
  {path: '', component: AppComponent},
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
