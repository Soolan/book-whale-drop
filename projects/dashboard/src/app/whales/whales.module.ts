import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WhalesRoutingModule } from './whales-routing.module';
import { LandingComponent } from './landing/landing.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';


@NgModule({
  declarations: [
    LandingComponent
  ],
  imports: [
    CommonModule,
    WhalesRoutingModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule
  ]
})
export class WhalesModule { }
