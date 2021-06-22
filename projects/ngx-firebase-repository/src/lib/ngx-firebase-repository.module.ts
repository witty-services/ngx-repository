import 'reflect-metadata';

import { ModuleWithProviders, NgModule, Provider } from '@angular/core';
import { FirebaseRepositoryBuilder } from './repository/firebase-repository.builder';
import {FIRESTORE_APP} from './ngx-firebase-repository.module.di';
import { REPOSITORY_BUILDER_TOKEN } from '@witty-services/ngx-repository';
import { FirebaseNormalizer } from './normalizer/firebase.normalizer';
import { FirebaseRepositoryDriver } from './driver/firebase-repository.driver';
import { FirebaseRequestBuilder } from './request/firebase-request.builder';
import { FirebaseResponseBuilder } from './response/firebase-response.builder';
import { FirebaseCriteriaRequestBuilder } from './request/firebase-criteria-request.builder';
import firebase from 'firebase';
import Firestore = firebase.firestore.Firestore;
import {LogExecuteFirebaseRequestEventListener} from './driver/listener/log-execute-firebase-request-event.listener';

const MODULE_PROVIDERS: Provider[] = [
  FirebaseRepositoryBuilder,
  FirebaseNormalizer,
  FirebaseRepositoryBuilder,
  FirebaseRepositoryDriver,
  FirebaseRequestBuilder,
  FirebaseCriteriaRequestBuilder,
  FirebaseResponseBuilder,
  {
    provide: REPOSITORY_BUILDER_TOKEN,
    useExisting: FirebaseRepositoryBuilder,
    multi: true
  }
];

export interface NgxFirebaseRepositoryModuleConfiguration { // @TODO: RMA/TNI : Add global configuration like ngx-http

  firestore?: Firestore;

  debug?: boolean;
}

/**
 * @ignore
 */
@NgModule({
  providers: [
    ...MODULE_PROVIDERS
  ]
})
export class NgxFirebaseRepositoryModule {

  public static forRoot(config: NgxFirebaseRepositoryModuleConfiguration = {debug: false}): ModuleWithProviders<NgxFirebaseRepositoryModule> {
    const providers: Provider[] = [
      {
        provide: FIRESTORE_APP,
        useValue: config.firestore
      }
    ];

    if (config.debug) {
      providers.push(LogExecuteFirebaseRequestEventListener);
    }

    return {
      ngModule: NgxFirebaseRepositoryModule,
      providers
    };
  }
}
