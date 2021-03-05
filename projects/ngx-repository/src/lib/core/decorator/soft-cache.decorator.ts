import {Observable, timer} from 'rxjs';
import {softCache} from '@witty-services/rxjs-common';
import {takeUntil} from 'rxjs/operators';
import {isObject} from 'lodash';
import {SoftCacheContext, SoftCacheContextConfiguration} from '../configuration/context/soft-cache-context.configuration';

/**
 * @ignore
 */
export const SOFT_CACHE_METADATA_KEY: string = 'softCache';

export function SoftCache(softCacheContext?: SoftCacheContext|number): any {
  return (target: object, propertyKey: string) => {
    let softCacheContextConfiguration: SoftCacheContextConfiguration = {
      propertyKey,
      expires: null
    };

    if (!!softCacheContext) {
      if (isObject(softCacheContext)) {
        softCacheContextConfiguration = {
          ...softCacheContextConfiguration,
          ...(softCacheContext as SoftCacheContext)
        };
      } else {
        softCacheContextConfiguration.expires = softCacheContext;
      }
    }

    Reflect.defineMetadata(SOFT_CACHE_METADATA_KEY, softCacheContextConfiguration, target, propertyKey);
  };
}

export function setSoftCache<T>(obs$: Observable<T>, target: any, propertyKey: string): Observable<T> {
  if (!hasSoftCache(target, propertyKey)) {
    return obs$;
  }

  const softCacheContextConfiguration: SoftCacheContextConfiguration = Reflect.getMetadata(SOFT_CACHE_METADATA_KEY, target, propertyKey);

  if (softCacheContextConfiguration.expires != null) {
    obs$.pipe(
      takeUntil(timer(softCacheContextConfiguration.expires))
    );
  }

  return obs$.pipe(
    softCache()
  );
}

export function hasSoftCache(target: any, propertyKey: string): boolean {
  return Reflect.hasMetadata(SOFT_CACHE_METADATA_KEY, target, propertyKey);
}
