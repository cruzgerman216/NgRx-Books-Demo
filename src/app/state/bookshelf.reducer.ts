import { createReducer, on } from '@ngrx/store';
import { Book } from '../shared/book.model';
import { addBook, removeBook } from './books.actions';

export const initialState: Book[] = [];
export const bookshelfReducer = createReducer(
  initialState,
  on(addBook, (state, { book }) => {
    // if the book exists in the state, don't add it
    if (state.indexOf(book) > -1) {
      return state;
    }
    return [...state, book];
  }),
  on(removeBook, (state, { bookId }) => {
    return state.filter(book=> book.id != bookId);
  })
);
