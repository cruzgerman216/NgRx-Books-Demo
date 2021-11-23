import { createAction, props } from "@ngrx/store";
import { Book } from "../shared/book.model";



export const addBook = createAction("[Bookshelf Component] Add Book", props<{book:Book}>())

export const removeBook = createAction("[Bookshelf Component] Remove Book", props<{bookId:string}>())

export const setAPIBooks = createAction("[Library Component] Set Library Books", props<{books:Book[]}>())