import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';
import { BASE_PATH } from './api';
import { API_BASE_URL } from './core/api.config';

export const appConfig: ApplicationConfig = {
  providers: [
    // App is zoneless (no zone.js): this drives change detection from signals.
    provideZonelessChangeDetection(),
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(),
    { provide: BASE_PATH, useValue: API_BASE_URL },
  ],
};
