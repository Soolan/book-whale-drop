import { NgModule } from '@angular/core';
import { SharedComponent } from './shared.component';
import { DialogComponent } from './components/dialog/dialog.component';
import {MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';

@NgModule({
  declarations: [
    SharedComponent,
    DialogComponent
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
