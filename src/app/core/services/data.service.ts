import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Root } from '../models/response.types';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private tableData = new BehaviorSubject<Root[]>([]); // Reactive tableData
  private loading = new BehaviorSubject<boolean>(false); // Reactive loading
  private searchQuery = new BehaviorSubject<any>(this.getDefaultSearchQuery());

  constructor() { }

  // Table Data Methods
  setTableData(data: Root[]): void {
    this.tableData.next(data); // Update the BehaviorSubject
  }

  getTableData(): Root[] {
    return this.tableData.getValue(); // Get the current value
  }

  getTableDataObservable() {
    return this.tableData.asObservable(); // Observable for components to subscribe
  }

  clearTableData(): void {
    this.tableData.next([]); // Clear and notify subscribers
  }

  // Search Query Methods
  updateSearchQuery(data: any): void {
    // Ensure timestamps are stored in ISO 8601 format
    const formattedQuery = {
      ...data,
      creationTimestampFrom: this.formatDateToISO(data.creationTimestampFrom),
      creationTimestampTo: this.formatDateToISO(data.creationTimestampTo),
    };
    this.searchQuery.next(formattedQuery); // Notify subscribers
  }

  getSearchQuery(): any {
    return this.searchQuery.getValue();
  }

  getSearchQueryObservable() {
    return this.searchQuery.asObservable();
  }

  // Default Search Query
  private getDefaultSearchQuery(): any {
    const currentDate = new Date();
    const twentyFourHoursAgo = new Date(currentDate);
    twentyFourHoursAgo.setHours(currentDate.getHours() - 24);

    return {
      flowType: null,
      translationDirection: null,
      creationTimestampFrom: this.formatDateToISO(twentyFourHoursAgo),
      creationTimestampTo: this.formatDateToISO(currentDate),
    };
  }

  // Helper Method to Format Date to ISO String
  private formatDateToISO(date: Date): string {
    return date ? new Date(date).toISOString().slice(0, 19) : null; // Keep only 'YYYY-MM-DDTHH:mm:ss'
  }

  // Loading
  getLoadingState() {
    return this.loading.getValue()
  }

  getLoadingStateObservable() {
    return this.loading.asObservable(); // Observable for components to subscribe
  }

  setLoadingState(data: boolean): void {
    this.loading.next(data); // Update the BehaviorSubject
  }
}
