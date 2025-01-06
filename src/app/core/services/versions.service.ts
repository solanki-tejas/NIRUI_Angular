import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Version {
  name: string;
  plainDescription: string;
  description: string;
  date: string;
}

@Injectable({
  providedIn: 'root',
})
export class VersionService {
  private jsonUrl = 'assets/versions.json'; // Path to your JSON file

  constructor(private http: HttpClient) { }

  // Get all versions
  getVersions(): Observable<Version[]> {
    return this.http.get<Version[]>(this.jsonUrl);
  }

  // Get a version by name
  getVersionByName(name: string): Observable<Version | undefined> {
    return this.getVersions().pipe(
      map((versions) => versions.find((version) => version.name === name))
    );
  }

  // Add a new version
  addVersion(newVersion: Version): Observable<Version[]> {
    // Update this function to include server-side logic if needed
    return this.getVersions().pipe(
      map((versions) => {
        versions.push(newVersion);
        return versions; // For demo purposes, this just returns updated versions
      })
    );
  }

  // Update a version by name
  updateVersion(
    name: string,
    updatedVersion: Partial<Version>
  ): Observable<Version[]> {
    return this.getVersions().pipe(
      map((versions) => {
        const index = versions.findIndex((version) => version.name === name);
        if (index !== -1) {
          versions[index] = { ...versions[index], ...updatedVersion };
        }
        return versions;
      })
    );
  }

  // Delete a version by name
  deleteVersion(name: string): Observable<Version[]> {
    return this.getVersions().pipe(
      map((versions) => versions.filter((version) => version.name !== name))
    );
  }

  getLastVersion(): Observable<Version | undefined> {
    return this.getVersions().pipe(
      map((versions) => versions[versions.length - 1]) // Return the last element
    );
  }
}
