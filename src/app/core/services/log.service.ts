import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  query,
  orderBy,
  collectionData,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export interface Log {
  datetime: string; // ISO string for date and time
  logType: string; // e.g., 'info', 'error', 'debug'
  log: string; // Actual log message
}

@Injectable({
  providedIn: 'root',
})
export class LogsService {
  private logsCollection = collection(this.firestore, 'logs'); // Reference to the 'logs' collection

  constructor(private firestore: Firestore) {}

  // Method to add a log
  async addLog(log: Log): Promise<void> {
    try {
      await addDoc(this.logsCollection, log);
      console.log('Log added successfully:', log);
    } catch (error) {
      console.error('Error adding log:', error);
    }
  }

  // Method to retrieve logs (sorted by datetime)
  getLogs(): Observable<Log[]> {
    const logsQuery = query(this.logsCollection, orderBy('datetime', 'asc'));
    return collectionData(logsQuery, { idField: 'id' }) as Observable<Log[]>;
  }
}
