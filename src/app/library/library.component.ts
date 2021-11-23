import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Book } from '../shared/book.model';
import { addBook } from '../state/books.actions';
import { bookshelfSelector, librarySelector } from '../state/selectors';

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.css']
})
export class LibraryComponent implements OnInit {
  libraryBooks:Observable<any> = this.store.select(librarySelector)
  constructor(private store:Store) { }

  ngOnInit(): void {
  }

  onAdd(book){
    this.store.dispatch(addBook({book}))
  }
}
