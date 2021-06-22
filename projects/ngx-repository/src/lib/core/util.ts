import {ID_METADATA_KEY} from './decorator/id.decorator';

export function getIdFromObject(object: any): any {
  if (object != null) {
    const idKey: string = Reflect.getMetadata(ID_METADATA_KEY, object);
    const id: string = object[idKey];

    return id || null;
  }

  return null;
}
