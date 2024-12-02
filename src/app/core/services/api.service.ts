import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ConfigService } from './config.service'; // Import ConfigService

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl: string;

  constructor(private http: HttpClient, private configService: ConfigService) {
    this.apiUrl = this.configService.apiUrl; // Load the API URL dynamically
  }

  // GET request
  getData(endpoint: string): Observable<any> {
    return this.http
      .get(`${this.apiUrl}/${endpoint}`)
      .pipe(catchError(this.handleError));
  }

  // POST request
  postData(endpoint: string, body: any): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/${endpoint}`, body)
      .pipe(catchError(this.handleError));
  }

  // Error handling
  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error.message);
    return throwError('Something went wrong. Please try again later.');
  }
}
