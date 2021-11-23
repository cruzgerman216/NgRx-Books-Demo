import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Book } from '../shared/book.model';
import { removeBook } from '../state/books.actions';
import { bookshelfSelector } from '../state/selectors';

@Component({
  selector: 'app-bookshelf',
  templateUrl: './bookshelf.component.html',
  styleUrls: ['./bookshelf.component.css']
})
export class BookshelfComponent implements OnInit {
  myBooks:Observable<any> = this.store.select(bookshelfSelector)
  constructor(private store:Store) { }

  ngOnInit(): void {
  }

  onRemove(bookId){
    this.store.dispatch(removeBook({bookId}))
  }

}
