import { Injectable, Inject } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class ConfigService {
    constructor(@Inject('APP_CONFIG') private config: any) { }

    get apiUrl(): string {
        return this.config.apiUrl;
    }
}
