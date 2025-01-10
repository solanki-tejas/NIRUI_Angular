import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { formatDateToISO } from 'src/app/shared/utils/functions';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private tableDataMap = new Map<string, BehaviorSubject<any[]>>(); // Map for table data
  private loadingMap = new Map<string, BehaviorSubject<boolean>>(); // Map for loading states
  private searchQueryMap = new Map<string, BehaviorSubject<any>>(); // Map for search queries
  private defaultQueries = new Map<string, any>(); // Map for storing default queries

  constructor() {
    const currentDate = new Date();
    const twentyFourHoursAgo = new Date(currentDate);
    twentyFourHoursAgo.setHours(currentDate.getHours() - 24);

    this.setDefaultQuery('messages', {
      flowType: null,
      translationDirection: null,
      creationTimestampFrom: formatDateToISO(twentyFourHoursAgo),
      creationTimestampTo: formatDateToISO(currentDate),
    });

    this.setDefaultQuery('application-logs', {
      logLevel: null,
      logType: null,
      logDateFrom: formatDateToISO(twentyFourHoursAgo),
      logDateTo: formatDateToISO(currentDate),
    });
  }

  // Table Data Methods
  setTableData(tableKey: string, data: any[]): void {
    if (!this.tableDataMap.has(tableKey)) {
      this.tableDataMap.set(tableKey, new BehaviorSubject<any[]>([]));
    }
    this.tableDataMap.get(tableKey)!.next(data); // Update the table data
  }

  getTableData(tableKey: string): any[] {
    return this.tableDataMap.get(tableKey)?.getValue() || [];
  }

  getTableDataObservable(tableKey: string) {
    if (!this.tableDataMap.has(tableKey)) {
      this.tableDataMap.set(tableKey, new BehaviorSubject<any[]>([]));
    }
    return this.tableDataMap.get(tableKey)!.asObservable();
  }

  clearTableData(tableKey: string): void {
    if (this.tableDataMap.has(tableKey)) {
      this.tableDataMap.get(tableKey)!.next([]);
    }
  }

  // Search Query Methods
  setDefaultQuery(tableKey: string, defaultQuery: any): void {
    this.defaultQueries.set(tableKey, defaultQuery); // Store the default query for the table
    if (!this.searchQueryMap.has(tableKey)) {
      this.searchQueryMap.set(tableKey, new BehaviorSubject<any>(defaultQuery));
    }
  }

  updateSearchQuery(tableKey: string, query: any): void {
    if (!this.searchQueryMap.has(tableKey)) {
      const defaultQuery = this.defaultQueries.get(tableKey) || {};
      this.searchQueryMap.set(tableKey, new BehaviorSubject<any>(defaultQuery));
    }
    this.searchQueryMap.get(tableKey)!.next(query); // Update the search query
  }

  getSearchQuery(tableKey: string): any {
    const defaultQuery = this.defaultQueries.get(tableKey) || {};
    return this.searchQueryMap.get(tableKey)?.getValue() || defaultQuery;
  }

  getSearchQueryObservable(tableKey: string) {
    if (!this.searchQueryMap.has(tableKey)) {
      const defaultQuery = this.defaultQueries.get(tableKey) || {};
      this.searchQueryMap.set(tableKey, new BehaviorSubject<any>(defaultQuery));
    }
    return this.searchQueryMap.get(tableKey)!.asObservable();
  }

  resetSearchQuery(tableKey: string): void {
    const defaultQuery = this.defaultQueries.get(tableKey) || {};
    if (this.searchQueryMap.has(tableKey)) {
      this.searchQueryMap.get(tableKey)!.next(defaultQuery);
    }
  }

  // Loading Methods
  getLoadingState(tableKey: string): boolean {
    return this.loadingMap.get(tableKey)?.getValue() || false;
  }

  getLoadingStateObservable(tableKey: string) {
    if (!this.loadingMap.has(tableKey)) {
      this.loadingMap.set(tableKey, new BehaviorSubject<boolean>(false));
    }
    return this.loadingMap.get(tableKey)!.asObservable();
  }

  setLoadingState(tableKey: string, state: boolean): void {
    if (!this.loadingMap.has(tableKey)) {
      this.loadingMap.set(tableKey, new BehaviorSubject<boolean>(false));
    }
    this.loadingMap.get(tableKey)!.next(state);
  }


}
