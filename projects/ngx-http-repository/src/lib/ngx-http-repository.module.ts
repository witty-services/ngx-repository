import 'reflect-metadata';

import {ModuleWithProviders, NgModule, Provider} from '@angular/core';
import {HttpRepositoryBuilder} from './repository/http-repository.builder';
import {HttpClientModule} from '@angular/common/http';
import {getRepositoryContextConfiguration, Repository, REPOSITORY_BUILDER_TOKEN} from '@witty-services/ngx-repository';
import {HttpRepositoryDriver} from './driver/http-repository.driver';
import {HttpResponseBuilder} from './response/http-response.builder';
import {HttpRequestBuilder} from './request/http-request.builder';
import {HttpRepositoryConfiguration} from './configuration/http-repository.configuration';
import {HttpRepository} from './repository/http.repository';
import {merge} from 'lodash';
import {createHttpRepositoryConfiguration, HttpRepositoryContextConfiguration} from './configuration/context/http-repository-context.configuration';
import {HttpFindAllResponseBuilder} from './response/http-find-all-response.builder';
import {LogExecuteHttpRequestEventListener} from './driver/listener/log-execute-http-request-event.listener';

const PROVIDERS: Provider[] = [
  HttpRepositoryBuilder,
  HttpRepositoryDriver,
  HttpRequestBuilder,
  HttpResponseBuilder,
  HttpFindAllResponseBuilder,
  {
    provide: REPOSITORY_BUILDER_TOKEN,
    useExisting: HttpRepositoryBuilder,
    multi: true
  }
];

export interface NgxHttpRepositoryModuleConfiguration {

  configuration?: HttpRepositoryContextConfiguration;

  debug: boolean;
}

/**
 * @ignore
 */
@NgModule({
  imports: [
    HttpClientModule
  ],
  providers: [
    ...PROVIDERS
  ]
})
export class NgxHttpRepositoryModule {

  public static forRoot(config: NgxHttpRepositoryModuleConfiguration = {debug: false}): ModuleWithProviders<NgxHttpRepositoryModule> {
    if (config.configuration) {
      const defaultConfiguration: HttpRepositoryConfiguration = getRepositoryContextConfiguration(HttpRepository).defaultConfiguration;

      Repository(null, merge({}, defaultConfiguration, createHttpRepositoryConfiguration(config.configuration)))(HttpRepository);
    }

    const providers: Provider[] = [];
    if (config.debug) {
      providers.push(LogExecuteHttpRequestEventListener);
    }

    return {
      ngModule: NgxHttpRepositoryModule,
      providers
    };
  }
}
