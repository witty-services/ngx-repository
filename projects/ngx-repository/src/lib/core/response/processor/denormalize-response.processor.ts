import {Injectable, Type} from '@angular/core';
import {RepositoryNormalizer} from '../../../normalizer/repository-denormalizer';
import {RepositoryResponse} from '../repository.response';
import {RequestManagerContext} from '../../manager/request-manager.context';
import {NormalizerConfiguration} from '@witty-services/ts-serializer';
import {ResponseProcessor} from './response.processor';
import {PublisherService} from '../../event-stream/publisher.service';
import {BeforeDenormalizeEvent} from '../../../normalizer/event/before-denormalize.event';
import {cloneDeep} from 'lodash';
import {AfterDenormalizeEvent} from '../../../normalizer/event/after-denormalize.event';

@Injectable()
export class DenormalizeResponseProcessor implements ResponseProcessor {

  public constructor(private readonly normalizer: RepositoryNormalizer) {
  }

  public transform(response: any, origin: RepositoryResponse, { configuration }: RequestManagerContext): any {
    const responseType: Type<any> = configuration.getConfiguration('responseType')();
    const normalizerConfiguration: NormalizerConfiguration = configuration.findConfiguration('normalizerConfiguration');

    PublisherService.getInstance().publish(new BeforeDenormalizeEvent(cloneDeep({type: responseType, body: response, normalizerConfiguration})));
    const data: any = this.normalizer.denormalize(responseType, response, normalizerConfiguration);
    PublisherService.getInstance().publish(new AfterDenormalizeEvent(cloneDeep({type: responseType, body: response, normalizerConfiguration, data})));

    return data;
  }
}
