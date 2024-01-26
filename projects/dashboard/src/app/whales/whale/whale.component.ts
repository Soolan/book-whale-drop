import {Component, OnInit} from '@angular/core';
import {doc, Firestore, getDoc, updateDoc} from '@angular/fire/firestore';
import {ActivatedRoute} from '@angular/router';
import {Whale} from '@shared-models/whale';
import {MatSnackBar} from '@angular/material/snack-bar';
import {WhaleFormService} from '@shared-services/whale-form.service';

@Component({
  selector: 'app-whale',
  templateUrl: './whale.component.html',
  styleUrl: './whale.component.scss'
})
export class WhaleComponent implements OnInit {
  id!: string;
  docRef!: any;

  constructor(
    private firestore: Firestore,
    private snackbar: MatSnackBar,
    private route: ActivatedRoute,
    protected formService: WhaleFormService
  ) {
  }

  ngOnInit() {
    this.form.reset();
    this.id = this.route.snapshot.paramMap.get('whaleId') || '';
    this.id ?
      this.initWhale():
      this.snackbar.open('Whale not found', 'X', {duration: 3000});
  }

  get form() {
    return this.formService.form;
  }

  private initWhale() {
    this.docRef = doc(this.firestore, "whales", this.id);
    getDoc(this.docRef).then(docSnap => {
      const whale = docSnap.data() as Whale;
      this.form.patchValue(whale);
    }).catch(error => this.snackbar.open(error.message, 'X', {duration: 6000}));
  }

  update() {
    updateDoc(this.docRef, this.form.value)
      .then(_ => this.snackbar.open('Whale updated', 'X', {duration: 3000}))
      .catch(error => this.snackbar.open(error.message, 'X', {duration: 6000}));
  }

  addStep() {
    this.formService.addStep();
  }

  deleteStep(index: number) {
    this.formService.deleteStep(index);
  }
}
