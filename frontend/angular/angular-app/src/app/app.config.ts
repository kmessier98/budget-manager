import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { ApiService } from './services/api-service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    providePrimeNG({ ripple: true, theme: { preset: Aura } }),
    ApiService,
  ],
};
