import { Observable, of } from 'rxjs';
import {
  AfterNormalizeEvent,
  BeforeNormalizeEvent,
  ConfigurationContextProvider,
  Path, PublisherService,
  RequestBuilder,
  RequestManagerContext
} from '@witty-services/ngx-repository';
import { FirebaseRepositoryRequest } from './firebase-repository.request';
import { Inject, Injectable } from '@angular/core';
import firebase from 'firebase';
import { FIRESTORE_APP } from '../ngx-firebase-repository.module.di';
import { FirebaseRepositoryParamConfiguration } from '../configuration/firebase-repository-param.configuration';
import { FirebaseOperation } from './firebase.operation';
import { FirebaseNormalizer } from '../normalizer/firebase.normalizer';
import Firestore = firebase.firestore.Firestore;
import {cloneDeep} from 'lodash';

// @dynamic
@Injectable()
export class FirebaseRequestBuilder implements RequestBuilder {

  public constructor(protected readonly normalizer: FirebaseNormalizer,
                     @Inject(FIRESTORE_APP) protected readonly firestore: Firestore) {
  }

  public build({ body, query, configuration }: RequestManagerContext): Observable<FirebaseRepositoryRequest> {
    const operation: FirebaseOperation = configuration.getOperation() as FirebaseOperation;
    const path: Path = this.getPath(body, query, configuration);
    const normalizedBody: any = this.getBody(body);

    return of(new FirebaseRepositoryRequest(operation, path, normalizedBody));
  }

  protected getPath(body: any, query: any, configuration: ConfigurationContextProvider): Path {
    const path: string = configuration.getConfiguration<FirebaseRepositoryParamConfiguration>('path');

    return new Path(body, query, path);
  }

  protected getBody(body: any): any {
    if (!body) {
      return null;
    }

    PublisherService.getInstance().publish(new BeforeNormalizeEvent(cloneDeep({body})));
    const data: any = this.normalizer.normalize(body);
    PublisherService.getInstance().publish(new AfterNormalizeEvent(cloneDeep({body, data})));

    return data;
  }
}
