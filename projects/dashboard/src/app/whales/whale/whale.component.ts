import {Component, OnInit} from '@angular/core';
import {doc, Firestore, getDoc, updateDoc} from '@angular/fire/firestore';
import {ActivatedRoute} from '@angular/router';
import {Whale} from '@shared-models/whale';
import {MatSnackBar} from '@angular/material/snack-bar';
import {WhaleFormService} from '@shared-services/whale-form.service';
import {WhaleSize} from '@shared-enums/whale-size';
import {MatDialog} from '@angular/material/dialog';
import {DialogComponent} from '@shared-components/dialog/dialog.component';
import {DIALOGS} from '@shared-constants/dialogs';
import {Dialog} from '@shared-enums/dialog';

@Component({
  selector: 'app-whale',
  templateUrl: './whale.component.html',
  styleUrl: './whale.component.scss'
})
export class WhaleComponent implements OnInit {
  id!: string;
  docRef!: any;
  whale!: Whale;

  constructor(
    private dialog: MatDialog,
    private firestore: Firestore,
    private snackbar: MatSnackBar,
    private route: ActivatedRoute,
    protected formService: WhaleFormService) {
  }

// After patching the form
  ngOnInit() {
    this.reset();
    this.id = this.route.snapshot.paramMap.get('whaleId') || '';
    this.id ?
      this.initWhale() :
      this.snackbar.open('Whale not found', 'X', {duration: 3000});
  }

  get form() {
    return this.formService.form;
  }

  private initWhale() {
    this.docRef = doc(this.firestore, "whales", this.id);
    getDoc(this.docRef).then(docSnap => {
      this.whale = docSnap.data() as Whale;
      this.patch();
    }).catch(error => this.snackbar.open(error.message, 'X', {duration: 6000}));
  }

  private reset() {
    this.form.reset();
    this.formService.resetPath();
  }

  private patch() {
    this.form.patchValue(this.whale);
    this.formService.patchPath(this.whale.path);
  }

  update() {
    if (!this.form.valid) {
      this.snackbar.open('Please resolve the issues first.', 'X', {duration: 3000});
      return;
    }
    updateDoc(this.docRef,this.getDTO())
      .then(_ => this.snackbar.open('Whale updated successfully.', 'X', {duration: 3000}))
      .catch(error => this.snackbar.open(error.message, 'X', {duration: 6000}));
  }

  addStep() {
    this.formService.addStep();
  }

  deleteStep(index: number) {
    const data = DIALOGS[Dialog.Delete];
    data.title = `Delete step ${index + 1}`;
    data.content = 'Are you sure you want to delete this step from the path?';
    const dialogRef = this.dialog.open(DialogComponent, {data});
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.formService.deleteStep(index);
      }
    });
  }

  getDTO(): Whale {
    const data = this.form.value;
    data.timestamps.updatedAt = Date.now();
    return data;
  }

  protected readonly WhaleSize = WhaleSize;
}
