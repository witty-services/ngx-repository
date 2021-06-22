import {Component} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {Library} from '../../module/@core/model/library.model';
import {Person} from '../../module/@core/model/person.model';
import {PersonService} from '../../module/@core/service/person.service';
import {map, switchMap} from 'rxjs/operators';
import {Page} from '@witty-services/ngx-repository';
import {Client} from '../../module/@core/model/client.model';
import {ClientService} from '../../module/@core/service/client.service';
import {OnDestroyListener} from '@witty-services/ngx-common';
import {softCache} from '@witty-services/rxjs-common';
import {LibraryService} from '../../module/@core/service/library.service';

@Component({
  selector: 'app-libraries',
  templateUrl: './libraries.component.html',
  styleUrls: ['./libraries.component.scss']
})
@OnDestroyListener()
export class LibrariesComponent {

  private readonly currentPageSubject: BehaviorSubject<number> = new BehaviorSubject<number>(1);

  private readonly searchedPersonFirstNameChangeSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);

  private readonly searchedClientLastNameChangeSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);

  public searchedPersonFirstName: string;

  public searchedClientLastName: string;

  public libraries$: Observable<Page<Library>>;

  public pages$: Observable<number[]>;

  public person$: Observable<Person[]>;

  public client$: Observable<Client[]>;

  public constructor(private libraryService: LibraryService,
                     private personService: PersonService,
                     private readonly clientService: ClientService) {
    this.libraries$ = this.currentPageSubject.pipe(
      switchMap((currentPage: number) => libraryService.findAll(currentPage, 5)),
      softCache()
    );

    this.pages$ = this.libraries$.pipe(
      map((page: Page<Library>) => Array.from(Array(Math.ceil(page.totalItems / page.itemsPerPage) - 1).keys())),
    );

    this.person$ = this.searchedPersonFirstNameChangeSubject.pipe(
      switchMap((searchedFirstName: string) => personService.searchByFirstName(searchedFirstName))
    );

    this.client$ = this.searchedClientLastNameChangeSubject.pipe(
      switchMap((searchedLastName: string) => clientService.searchByLastName(searchedLastName))
    );
  }

  public onSearchedPersonFirstNameChange(): void {
    this.searchedPersonFirstNameChangeSubject.next(this.searchedPersonFirstName);
  }

  public onSearchedClientLastNameChange(): void {
    this.searchedClientLastNameChangeSubject.next(this.searchedClientLastName);
  }

  public onClickOnPage(page: number): void {
    this.currentPageSubject.next(page);
  }

  public createLibrary(): void {
    this.libraryService.create().subscribe();
  }

  public createPerson(): void {
    this.personService.create().subscribe();
  }

  public createClient(): void {
    this.clientService.create().subscribe();
  }

  public deleteClient(client: Client): void {
    this.clientService.delete(client).subscribe();
  }

  public updateClient(client: Client): void {
    this.clientService.update(client).subscribe();
  }

  public patchClient(client: Client): void {
    this.clientService.patchClient(client).subscribe();
  }

  public updatePerson(person: Person): void {
    this.personService.update(person).subscribe();
  }

  public patchPerson(person: Person): void {
    this.personService.patch(person).subscribe();
  }
}
