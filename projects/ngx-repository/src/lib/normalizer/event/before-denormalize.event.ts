import {Type} from '@angular/core';
import {NormalizerConfiguration} from '@witty-services/ts-serializer';

export class BeforeDenormalizeEvent {

  public type: Type<any>;

  public body: any;

  public configuration: NormalizerConfiguration;

  public constructor(data: Partial<BeforeDenormalizeEvent> = {}) {
    Object.assign(this, data);
  }
}
