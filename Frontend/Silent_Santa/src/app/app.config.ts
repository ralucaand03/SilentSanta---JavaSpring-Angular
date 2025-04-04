import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { FormsModule } from '@angular/forms';  // Import FormsModule
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';

import { AuthTokenInterceptor } from "./auth/auth-token.interceptor";

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([AuthTokenInterceptor])),
    FormsModule  
  ]
}
