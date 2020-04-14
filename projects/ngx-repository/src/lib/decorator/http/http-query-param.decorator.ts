import {cloneDeep} from 'lodash';

export const HTTP_QUERY_PARAM_METADATA_KEY: string = 'httpQueryParams';

export interface HttpQueryParamContext {
  name?: string;
  format?: string;
}

export interface HttpQueryParamContextConfiguration extends HttpQueryParamContext {
  propertyKey: string;
}

export function HttpQueryParam(params?: HttpQueryParamContext|string): any {
  return (target: any, propertyKey: string) => {
    let httpQueryParamContextConfiguration: HttpQueryParamContextConfiguration = {
      propertyKey,
      name: propertyKey,
      format: ':value'
    };

    if (typeof params === 'object') {
      httpQueryParamContextConfiguration = {
        ...httpQueryParamContextConfiguration,
        ...params
      };
    } else if (typeof params === 'string') {
      httpQueryParamContextConfiguration.name = params;
    }

    let metas: HttpQueryParamContext[] = [];
    if (Reflect.hasMetadata(HTTP_QUERY_PARAM_METADATA_KEY, target)) {
      metas = Reflect.getMetadata(HTTP_QUERY_PARAM_METADATA_KEY, target);
    }
    Reflect.defineMetadata(HTTP_QUERY_PARAM_METADATA_KEY, metas.concat(httpQueryParamContextConfiguration), target);

    let value: any;

    Object.defineProperty(target, propertyKey, {
      get: () => !!value ? cloneDeep(httpQueryParamContextConfiguration.format).replace(/:value/gi, value) : value,
      set: (newValue: any) => value = newValue,
      enumerable: true,
      configurable: true
    });
  };
}
