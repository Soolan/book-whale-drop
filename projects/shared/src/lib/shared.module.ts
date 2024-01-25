import { NgModule } from '@angular/core';
import { SharedComponent } from './shared.component';
import {MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';

@NgModule({
  declarations: [
    SharedComponent
  ],
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatButtonModule,
    MatDialogClose
  ],
  exports: [
    SharedComponent
  ]
})
export class SharedModule { }
