import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {doc, Firestore, getDoc, updateDoc} from '@angular/fire/firestore';
import {ActivatedRoute} from '@angular/router';
import {Whale} from '@shared-models/whale';
import {MatSnackBar} from '@angular/material/snack-bar';
import {WhaleFormService} from '@shared-services/whale-form.service';
import {DASHBOARD_NAV} from '@shared-constants/menus';
import {WhaleSize} from '@shared-enums/whale-size';
import {FormControl} from '@angular/forms';

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
    private firestore: Firestore,
    private snackbar: MatSnackBar,
    private route: ActivatedRoute,
    protected formService: WhaleFormService,
    private cdr: ChangeDetectorRef) {
}

// After patching the form
  ngOnInit() {
    this.reset();
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
      this.whale = docSnap.data() as Whale;
      this.patch();
      this.cdr.detectChanges();

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

  getDTO(): Whale {
    const data = this.form.value;
    data.timestamps.updated_at = Date.now();
    return data;
  }

  protected readonly menu = DASHBOARD_NAV;
  protected readonly WhaleSize = WhaleSize;
  protected readonly FormControl = FormControl;
}
