import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import {map, startWith, switchMap} from 'rxjs/operators';
import {Observable, merge, of, from} from 'rxjs';
import {Whale, WhaleWithId} from '@shared-models/whale';
import {collection, Firestore, getDocs, orderBy, query} from '@angular/fire/firestore';
import {inject} from '@angular/core';

/**
 * Data source for the Landing view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class LandingDataSource extends DataSource<WhaleWithId> {
  paginator: MatPaginator | undefined;
  sort: MatSort | undefined;
  private firestore = inject(Firestore);

  constructor() {
    super();
  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<any> {
    return this.getData().pipe(
      switchMap((data: WhaleWithId[]) => {
        if (this.paginator && this.sort) {
          // Set up paginator and sort once the initial data is fetched
          this.paginator.length = data.length;
          return merge(of(data), this.paginator.page, this.sort.sortChange).pipe(
            map(() => this.getPagedData(this.getSortedData([...data])))
          );
        } else {
          throw Error('Please set the paginator and sort on the data source before connecting.');
        }
      })
    );
  }

  private getData(): Observable<WhaleWithId[]> {
    const whalesCollection = collection(this.firestore, 'whales');
    const queryWithOrder = query(whalesCollection, orderBy('timestamps.createdAt', 'desc'));
    return from(getDocs(queryWithOrder)).pipe(
      map(snapshot => snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as WhaleWithId))),
      startWith([]) // Emit an empty array to start the stream
    );
  }

  /**
   *  Called when the table is being destroyed. Use this function, to clean up
   * any open connections or free any held resources that were set up during connect.
   */
  disconnect(): void {}

  /**
   * Paginate the data (client-side). If you're using server-side pagination,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getPagedData(data: Whale[]): Whale[] {
    if (this.paginator) {
      const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
      return data.slice(startIndex, startIndex + this.paginator.pageSize);
    } else {
      return data;
    }
  }

  /**
   * Sort the data (client-side). If you're using server-side sorting,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getSortedData(data: Whale[]): Whale[] {
    if (!this.sort || !this.sort.active || this.sort.direction === '') {
      return data;
    }
    return data.sort((a, b) => {
      const isAsc = this.sort?.direction === 'asc';
      switch (this.sort?.active) {
        case 'name': return compare(a.name, b.name, isAsc);
        case 'description': return compare(+a.description, +b.description, isAsc);
        case 'speed': return compare(+a.speed, +b.speed, isAsc);
        case 'views': return compare(+a.views, +b.views, isAsc);
        default: return 0;
      }
    });
  }
}

/** Simple sort comparator for example ID/Name columns (for client-side sorting). */
function compare(a: string | number, b: string | number, isAsc: boolean): number {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
