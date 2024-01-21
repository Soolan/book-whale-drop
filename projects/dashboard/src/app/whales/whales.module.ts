import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WhalesRoutingModule } from './whales-routing.module';
import { LandingComponent } from './landing/landing.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { WhaleComponent } from './whale/whale.component';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';


@NgModule({
  declarations: [
    LandingComponent,
    WhaleComponent
  ],
  imports: [
    CommonModule,
    WhalesRoutingModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule
  ]
})
export class WhalesModule { }
