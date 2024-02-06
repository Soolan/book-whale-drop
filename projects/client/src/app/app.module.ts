import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAnalytics, provideAnalytics, ScreenTrackingService } from '@angular/fire/analytics';
import {connectFirestoreEmulator, getFirestore, provideFirestore} from '@angular/fire/firestore';
import {connectFunctionsEmulator, getFunctions, provideFunctions} from '@angular/fire/functions';
import {connectAuthEmulator, getAuth, provideAuth} from '@angular/fire/auth';
import {environment} from '../environments/environment';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import { LandingComponent } from './landing/landing.component';
import { CameraComponent } from './landing/camera/camera.component';
import {MatDialogClose} from '@angular/material/dialog';
import { MapComponent } from './map/map.component';
import {MatSelectModule} from '@angular/material/select';
import {MatTabsModule} from '@angular/material/tabs';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import 'aframe';
import 'ar.js';
import { GpsNewEntityPlaceDirective } from './directives/gps-new-entity-place.directive';
import { PositionDirective } from './directives/position.directive';
import { AnimationDirective } from './directives/animation.directive';
import { GltfModelDirective } from './directives/gltf-model.directive';

@NgModule({
  declarations: [
    AppComponent,
    LandingComponent,
    CameraComponent,
    MapComponent,
    GpsNewEntityPlaceDirective,
    PositionDirective,
    AnimationDirective,
    GltfModelDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAnalytics(() => getAnalytics()),
    provideAuth(() => {
      const auth = getAuth();
      if (environment.useEmulators) {
        connectAuthEmulator(auth, 'http://localhost:9099', {disableWarnings: true});
      }
      return auth;
    }),
    provideFirestore(() => {
      const firestore = getFirestore();
      if (environment.useEmulators) {
        connectFirestoreEmulator(firestore, 'localhost', 8080);
      }
      return firestore;
    }),
    provideFunctions(() => {
      const functions = getFunctions();
      if (environment.useEmulators) {
        connectFunctionsEmulator(functions, 'localhost', 5001);
      }
      return functions;
    }),
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatDialogClose,
    MatSelectModule,
    MatTabsModule,
    MatProgressBarModule,
  ],
  providers: [
    ScreenTrackingService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
