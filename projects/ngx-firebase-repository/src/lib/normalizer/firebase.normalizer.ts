import {Inject, Injectable} from '@angular/core';
import {set} from 'lodash';
import firebase from 'firebase';
import {FIREBASE_CREATED_AT_METADATA_KEY} from '../decorator/firebase-created-at.decorator';
import {FIREBASE_UPDATED_AT_METADATA_KEY} from '../decorator/firebase-updated-at.decorator';
import {NormalizerConfiguration, RepositoryNormalizer} from '@witty-services/ngx-repository';
import {FirebaseCreatedAtContextConfiguration} from '../configuration/context/firebase-created-at-context.configuration';
import {FirebaseUpdatedAtContextConfiguration} from '../configuration/context/firebase-updated-at-context.configuration';
import FieldValue = firebase.firestore.FieldValue;
import {NORMALIZER_CONFIGURATION_TOKEN} from '@witty-services/ngx-serializer';

/**
 * @ignore
 */
@Injectable()
export class FirebaseNormalizer extends RepositoryNormalizer {

  public constructor(@Inject(NORMALIZER_CONFIGURATION_TOKEN) configuration: NormalizerConfiguration) {
    super(configuration);
  }

  public normalize<T>(object: T): any {
    const result: {} = super.normalize(object);

    const createdAts: FirebaseCreatedAtContextConfiguration[] = Reflect.getMetadata(FIREBASE_CREATED_AT_METADATA_KEY, object) || [];
    createdAts.forEach((createdAt: FirebaseCreatedAtContextConfiguration) => {
      set(result, createdAt.field, FieldValue.serverTimestamp());
    });

    const updatedAts: FirebaseUpdatedAtContextConfiguration[] = Reflect.getMetadata(FIREBASE_UPDATED_AT_METADATA_KEY, object) || [];
    updatedAts.forEach((updatedAt: FirebaseUpdatedAtContextConfiguration) => {
      set(result, updatedAt.field, FieldValue.serverTimestamp());
    });

    return result;
  }
}
