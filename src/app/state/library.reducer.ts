import { createReducer, on } from '@ngrx/store';
import { Book } from '../shared/book.model';
import { setAPIBooks } from './books.actions';

export const initialState: Book[] = [];

export const LibraryReducer = createReducer(
  initialState,
  on(setAPIBooks, (state, { books }) => {
      console.log(books)
    return books;
  })
);
