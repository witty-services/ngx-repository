import {Component} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Observable} from 'rxjs';
import {Library} from '../../module/@core/model/library.model';
import {filter, map, switchMap, tap} from 'rxjs/operators';
import {LibraryService} from '../../module/@core/service/library.service';
import {Book} from '../../module/@core/model/book.model';
import {BookService} from '../../module/@core/service/book.service';
import { clone } from 'lodash';

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.scss']
})
export class LibraryComponent {

  public libraryName: string;

  public library$: Observable<Library>;

  private expandedBooks: Map<string, boolean> = new Map<string, boolean>();

  public constructor(activatedRoute: ActivatedRoute,
                     private libraryService: LibraryService,
                     private bookService: BookService,
                     private router: Router) {
    this.library$ = activatedRoute.params.pipe(
      filter((params: Params) => !!params),
      map((params: Params) => params[`libraryId`]),
      switchMap((libraryId: string) => this.libraryService.findById(libraryId)),
      tap((library: Library) => this.libraryName = library.name)
    );
  }

  public bookIsExpanded(book: Book): boolean {
    return this.expandedBooks.has(book.id) && !!this.expandedBooks.get(book.id);
  }

  public toggleBook(book: Book): void {
    if (!this.expandedBooks.has(book.id)) {
      this.expandedBooks.set(book.id, true);
    } else {
      this.expandedBooks.set(book.id, !this.expandedBooks.get(book.id));
    }
  }

  public onUpdateLibrary(library: Library): void {
    const libraryToUpdate: Library = clone(library);
    libraryToUpdate.name = this.libraryName;
    this.libraryService.update(libraryToUpdate).subscribe();
  }

  public onDeleteLibrary(library: Library): void {
    this.libraryService.delete(library).subscribe(() => this.router.navigate(['/']));
  }

  public onUpdateBookTitle(book: Book): void {
    this.bookService.update(book).subscribe();
  }
}
