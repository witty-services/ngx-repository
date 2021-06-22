import { InjectionToken } from '@angular/core';
import firebase from 'firebase';
import Firestore = firebase.firestore.Firestore;

/** @ignore */
export const FIRESTORE_APP: InjectionToken<Firestore> = new InjectionToken<Firestore>('FIRESTORE_APP');
