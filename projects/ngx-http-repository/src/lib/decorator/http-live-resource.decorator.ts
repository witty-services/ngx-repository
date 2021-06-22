/**
 * @ignore
 */
export const HTTP_LIVE_RESOURCE_METADATA_KEY: string = 'ngx-http-repository:http-live-resource';

export function HttpLiveResource(): any {
  return (target: any): any => {
    Reflect.defineMetadata(HTTP_LIVE_RESOURCE_METADATA_KEY, true, target);
  };
}
