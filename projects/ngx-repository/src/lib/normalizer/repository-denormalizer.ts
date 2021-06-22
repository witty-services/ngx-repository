import { Inject, Injectable, Type } from '@angular/core';
import { isArray } from 'lodash';
import { Denormalizer, Normalizer, NormalizerConfiguration } from '@witty-services/ts-serializer';
import {NORMALIZER_CONFIGURATION_TOKEN} from '@witty-services/ngx-serializer';

@Injectable()
export class RepositoryNormalizer {

  protected readonly normalizer: Normalizer;
  protected readonly denormalizer: Denormalizer;

  public constructor(@Inject(NORMALIZER_CONFIGURATION_TOKEN) configuration: NormalizerConfiguration) {
    this.normalizer = new Normalizer(configuration);
    this.denormalizer = new Denormalizer(configuration);
  }

  public denormalize(type: Type<any>, body: any, configuration?: NormalizerConfiguration): any {
    const denormalizer: Denormalizer = configuration ? new Denormalizer(configuration) : this.denormalizer;

    if (isArray(body)) {
      return body.map((item: any) => denormalizer.deserialize(type, item));
    } else {
      return denormalizer.deserialize(type, body);
    }
  }

  public normalize(body: any, configuration?: NormalizerConfiguration): any {
    const normalizer: Normalizer = configuration ? new Normalizer(configuration) : this.normalizer;

    return normalizer.serialize(body);
  }
}
