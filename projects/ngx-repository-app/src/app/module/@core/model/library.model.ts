import { Identifiable } from './identifiable.model';
import { Observable } from 'rxjs';
import { Book } from './book.model';
import { Address } from './address.model';
import { BookQuery } from '../query/book.query';
import { Column, DateConverter, Page, SubCollection } from '@witty-services/ngx-repository';
import {HttpLiveResource, HttpRepository, HttpResource, HttpResponseBuilder} from '@witty-services/ngx-http-repository';
import { MyPageResponseProcessor } from '../processor/my-page-response.processor';

@HttpLiveResource()
@HttpResource({
  path: '/libraries',
  update: '/library',
  findAll: {
    pageResponseProcessor: MyPageResponseProcessor
  }
})
export class Library extends Identifiable {

  @Column()
  public name: string;

  @Column({ denormalizeNull: true })
  public description: string;

  @Column(() => Address)
  public address: Address;

  @Column({ field: 'test', writeOnly: true })
  public test: string;

  @Column()
  public opened: boolean;

  @Column({ field: 'createdAt', customConverter: () => DateConverter })
  public createdAt: Date;

  @SubCollection({
    resourceType: () => Book,
    params: (library: Library) => new BookQuery({ LIBRARY_ID: library.id }),
    repository: () => HttpRepository
  })
  public books$: Observable<Page<Book>>;

  public constructor(data: Partial<Library> = {}) {
    super(data);

    this.test = 'test';
  }
}
