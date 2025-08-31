import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimationsAsync(),
    provideFirebaseApp(() => initializeApp({
      apiKey: "AIzaSyAqxyWYnV2GSE0ZLvekwfLHn7fo8R5pAKI",
      authDomain: "progress-tracker-6692b.firebaseapp.com",
      projectId: "progress-tracker-6692b",
      storageBucket: "progress-tracker-6692b.firebasestorage.app",
      messagingSenderId: "97612029381",
      appId: "1:97612029381:web:3c4e728c3a03c2811fbfac",
      measurementId: "G-4MSLSZ1J62"
    })),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideHttpClient()
  ]
};
