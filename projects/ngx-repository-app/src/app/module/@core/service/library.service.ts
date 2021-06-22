import { Injectable } from '@angular/core';
import { Library } from '../model/library.model';
import { Observable } from 'rxjs';
import { LibraryQuery } from '../query/library.query';
import { InjectRepository, Page } from '@witty-services/ngx-repository';
import { HttpRepository } from '@witty-services/ngx-http-repository';
import {Chance} from 'chance';

@Injectable()
export class LibraryService {

  private chance: Chance.Chance = new Chance.Chance();

  @InjectRepository({resourceType: () => Library, repository: () => HttpRepository})
  private readLibraryRepository: HttpRepository<Library, string>;

  @InjectRepository({resourceType: () => Library, repository: () => HttpRepository})
  private writeLibraryRepository: HttpRepository<Library, string>;

  public findAll(currentPage: number, itemPerPage: number): Observable<Page<Library>> {
    return this.readLibraryRepository.findAll(new LibraryQuery({
      opened: true,
      page: currentPage,
      itemPerPage
    }));
  }

  public findById(id: string): Observable<Library> {
    return this.readLibraryRepository.findById(id);
  }

  public create(): Observable<string> {
    return this.writeLibraryRepository.create(new Library({
      id: `${Date.now()}`,
      name: this.chance.company(),
      opened: true
    }));
  }

  public update(library: Library): Observable<void> {
    return this.writeLibraryRepository.update(library);
  }

  public delete(library: Library): Observable<void> {
    return this.writeLibraryRepository.delete(library);
  }
}
