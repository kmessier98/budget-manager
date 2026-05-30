import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { registerLocaleData } from '@angular/common';
import localeFrCa from '@angular/common/locales/fr-CA';

registerLocaleData(localeFrCa);

bootstrapApplication(App, appConfig).catch((err) => console.error(err));
