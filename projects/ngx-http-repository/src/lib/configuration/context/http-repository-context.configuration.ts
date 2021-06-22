import { HttpRepositoryParamContextConfiguration } from './http-repository-param-context.configuration';
import {HttpOperation, isHttpOperation} from '../../request/http.operation';
import { HttpRepositoryParamConfiguration } from '../http-repository-param.configuration';
import { isString, isUndefined } from 'lodash';
import { HttpRepositoryConfiguration } from '../http-repository.configuration';
import { HttpRepositoryFindAllParamContextConfiguration } from './http-repository-find-all-param-context.configuration';
import { HttpFindAllResponseBuilder } from '../../response/http-find-all-response.builder';

export interface HttpRepositoryContextConfiguration extends HttpRepositoryParamContextConfiguration {
  read?: HttpRepositoryParamContextConfiguration | string;
  write?: HttpRepositoryParamContextConfiguration | string;
  findById?: HttpRepositoryParamContextConfiguration | string;
  findOne?: HttpRepositoryParamContextConfiguration | string;
  findAll?: HttpRepositoryFindAllParamContextConfiguration | string;
  create?: HttpRepositoryParamContextConfiguration | string;
  update?: HttpRepositoryParamContextConfiguration | string;
  patch?: HttpRepositoryParamContextConfiguration | string;
  delete?: HttpRepositoryParamContextConfiguration | string;
}

export function createHttpRepositoryConfiguration(params: HttpRepositoryContextConfiguration): HttpRepositoryContextConfiguration {
  const configuration: HttpRepositoryConfiguration = {};

  Object.keys(params).forEach((key: string) => {
    if (key === 'findAll') {
      configuration[key] = createFindAllParam(params[key]);
    } else if (isHttpOperation(key)) {
      configuration[key] = createOperationParams(params[key]);
    } else if (isUndefined(configuration[key])) {
      configuration[key] = params[key];
    }
  });

  return configuration;
}

function createFindAllParam(param: any): HttpRepositoryParamConfiguration {
  const configuration: HttpRepositoryParamConfiguration = createOperationParams(param);

  if (param.pageResponseProcessor) {
    configuration.response = HttpFindAllResponseBuilder.withParams({
      pageResponseProcessor: param.pageResponseProcessor
    });
  }

  return configuration;
}

function createOperationParams(param: any): HttpRepositoryParamConfiguration {
  if (isString(param)) {
    return {
      path: param
    };
  }

  return param;
}
