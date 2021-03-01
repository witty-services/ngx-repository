import {IdContext} from '../decorator/id.decorator';
import {Page} from '../page-builder/page';
import {Observable} from 'rxjs';

/**
 * @ignore
 */
export interface Repository<T, K> {

  findAll(query?: any): Observable<Page<T>>;

  findById(id: K, query: any): Observable<T>;

  findOne(query: any): Observable<T>;

  create(object: T, query?: any): Observable<K>;

  update(object: T, query: any): Observable<void>;

  delete(object: T, query: any): Observable<void>;

  getResourceId(object: T): K;

  getIdContext(): IdContext;
}
