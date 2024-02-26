import {AfterViewInit,  Component, ElementRef, ViewChild} from '@angular/core';
import {MatTable} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {LandingDataSource} from './landing-datasource';
import {Whale} from '@shared-models/whale';
import {EXPAND_COLLAPSE_ANIMATION} from '@shared-constants/animations';
import {MapService} from '@shared-services/map.service';
import {DialogComponent} from '@shared-components/dialog/dialog.component';
import {DIALOGS} from '@shared-constants/dialogs';
import {Dialog} from '@shared-enums/dialog';
import {MatDialog} from '@angular/material/dialog';
import {addDoc, collection, doc, Firestore, updateDoc} from '@angular/fire/firestore';
import {MatSnackBar} from '@angular/material/snack-bar';
import {NEW_WHALE} from '@shared-constants/whales';
import {Router} from '@angular/router';
import {error} from 'ng-packagr/lib/utils/log';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss',
  animations: [EXPAND_COLLAPSE_ANIMATION]
})
export class LandingComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<Whale>;

  dataSource = new LandingDataSource();
  displayedColumns = ['name', 'description', 'speed', 'views', 'actions'];
  expandedWhale!: Whale | null;

  constructor(
    private mapService: MapService,
    private snackbar: MatSnackBar,
    private firestore: Firestore,
    public dialog: MatDialog,
    private router: Router
  ) { }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.dataSource.connect().subscribe(data => {
      this.paginator.length = data.length;
      this.table.dataSource = data;
    });
  }

  toggle(whale: Whale) {
    this.expandedWhale = this.expandedWhale === whale ? null : whale;
    if (this.expandedWhale) {
      const id = `map-${whale.timestamps.createdAt}`;
      const mapContainer = new ElementRef(document.getElementById(id));
      this.mapService.initMap(mapContainer);
      this.mapService.addPathMarkers(this.expandedWhale.path);
      this.mapService.setPolylines(this.expandedWhale.path, this.expandedWhale.completedSteps);
      const isActive = this.expandedWhale.timestamps.deletedAt == 0;
      this.mapService.addWhaleMarker(this.expandedWhale, isActive);
    }
  }

  delete(id: string) {
    const dialogRef = this.dialog.open(DialogComponent, {data: DIALOGS[Dialog.Delete]});
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const whaleRef = doc(this.firestore, "whales", id);
        updateDoc(whaleRef, {'timestamps.deletedAt': Date.now() })
          .then(_ =>  this.snackbar.open('Document deleted successfully', 'X', {duration: 3000}))
          .catch(error => this.snackbar.open(error.message, 'X', {duration: 6000}));
      }
    });
  }

  add() {
    addDoc(collection(this.firestore, "whales"), NEW_WHALE)
      .then(docRef => {
        this.router.navigate(['whales', docRef.id]).then(r =>
          this.snackbar.open('Document added successfully', 'X', {duration: 3000}));
      })
      .catch(error => this.snackbar.open(error.message, 'X', {duration: 6000}));
  }
}
