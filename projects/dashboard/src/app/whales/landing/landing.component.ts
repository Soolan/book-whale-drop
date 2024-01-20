import {AfterViewInit,  Component, ElementRef, ViewChild} from '@angular/core';
import {MatTable} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {LandingDataSource} from './landing-datasource';
import {Whale} from '../../../../../shared/src/lib/models/whale';
import {EXPAND_COLLAPSE_ANIMATION} from '../../../../../shared/src/lib/constants/animations';

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


  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }
}
