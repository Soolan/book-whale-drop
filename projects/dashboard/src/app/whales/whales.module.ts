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
import {MatDividerModule} from '@angular/material/divider';
import {MatFormFieldModule} from '@angular/material/form-field';
import {ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatStepperModule} from '@angular/material/stepper';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatSliderModule} from '@angular/material/slider';
import {MatTabsModule} from '@angular/material/tabs';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatProgressBarModule} from '@angular/material/progress-bar';


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
    MatIconModule,
    MatDividerModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatExpansionModule,
    MatStepperModule,
    MatButtonToggleModule,
    MatSliderModule,
    MatTabsModule,
    MatProgressSpinnerModule,
    MatProgressBarModule
  ]
})
export class WhalesModule { }
