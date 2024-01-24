import {Component, Inject, ViewEncapsulation} from '@angular/core';
import {Dialog} from '@shared-models/dialog';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'lib-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
})
export class DialogComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Dialog,
  ) {}

  confirm(): void {
    this.dialogRef.close(true);
  }
}
