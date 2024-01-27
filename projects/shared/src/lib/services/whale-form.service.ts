import {Injectable} from '@angular/core';
import {FormBuilder, FormGroup, UntypedFormArray, UntypedFormGroup, Validators} from '@angular/forms';
import {WhaleSize} from '@shared-enums/whale-size';
import {Coordinate} from '@shared-models/whale';

@Injectable({
  providedIn: 'root'
})
export class WhaleFormService {
  form: FormGroup;
  coordinatesForm: FormGroup = this.formBuilder.group({
    latitude: [0, Validators.required],
    longitude: [0, Validators.required],
    locationName: [''],
  });

  timestampsForm: FormGroup = this.formBuilder.group({
    createdAt: [0, Validators.required],
    updatedAt: [0, Validators.required],
    deletedAt: [0, Validators.required]
  });

  constructor(private formBuilder: FormBuilder) {

    this.form = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(50)]],
      size: [WhaleSize.Medium, Validators.required],
      description: ['', Validators.maxLength(300)],
      altitude: [10, [Validators.required, Validators.min(10)]],
      speed: [0, [Validators.required, Validators.min(0)]],
      views: [0, [Validators.required]],
      path: this.formBuilder.array([this.coordinatesForm]),
      lastSeen: this.coordinatesForm,
      completedSteps: [0, Validators.required],
      timestamps: this.timestampsForm
    });
  }

  // path array operations ===================================
  get pathArray(): UntypedFormArray {
    return this.form.get(['path']) as UntypedFormArray;
  }

  // Add a new set of coordinates to the path array
  addStep(): UntypedFormGroup {
    const coordinatesFormGroup = this.formBuilder.group({
      latitude: [0, Validators.required],
      longitude: [0, Validators.required],
      locationName: [''],
    });
    this.pathArray.push(coordinatesFormGroup);
    this.form.markAsDirty();
    return coordinatesFormGroup;
  }

  // Delete a set of coordinates from the path array based on index
  deleteStep(index: number): void {
    this.pathArray.removeAt(index);
    this.form.markAsDirty();
  }

  // Patch the path array with a set of coordinates
  patchPath(path: Coordinate[]): void {
    for (const step of path) {
      const group = this.addStep();
      group.patchValue(step);
    }
  }

  // Reset the path array
  resetPath(): void {
    this.pathArray.clear();
  }
}
