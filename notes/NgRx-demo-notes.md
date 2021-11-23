# Class 16 - NgRx Part 1

---

## Project Outline

1. Basic Project Setup
2. Add Book Model
3. Add Book Service (Api Call)
4. Add Actions
5. Add Reducers
6. Add AppState
7. Add Selectors
8. Add Library
9. Add Bookshelf
10. Displaying UI

---

---

## NgRx/Application State Solutions Overview

- **Application State** The representation in memory of everything your app needs to keep running. It is all of the data we are storing and using before we pass any of it off to a backend/database. When the page is refreshed, application state is reset.

- **NgRx** (Reactive State for Angular): For bigger applications, NgRx provides a scalable solution to managing application state in a predictable, centralized, and streamlined way. NgRx is Angular implementation of Redux.

- **Redux** You have a central store that holds all of your application state. Components and Services receive and send all state to your store by dispatching actions. Every action has an identifier and a payload/data. Actions are sent to a reducer (a javascript function) that gets the combines the new state and the old state in an immutable way. The reducer updates the store with the new state.

![NgRx State Managment Lifecycle](./state-management-lifecycle.png)

- A simple example of application/local state is when we create an "isLoading" variable in a component. When certain functions run, we change that isLoading variable to true or false. This changes the state of the application, but when we refresh, everything is reset.

- Smaller to Medium apps can use services and components to manage your application state, but the larger it grows, you could end up in a hard-to-maintain app.

- The problems with RxJS application state managment is that your state can be updated from anywhere, it is possibly mutable, and handling side-effects (like Http requests) don't have a clear best-practices. In short, there is no specific patterns to enforce a sustainable state managment approach.

---

---

## Project Steps

### STEP 1: Basic Project Setup

#### Startup Command Line

```zsh
    ng new NgRxBooks --no-strict

    npm install --save bootstrap@4
```

1. Import "node_modules/bootstrap/dist/css/bootstrap.min.css" in angular.json under "styles" tag.
2. Clear App component HTML.
3. Test For Bootstrap by adding a container div with a row and column with text inside.
4. Import HttpClientModule in app.module.ts

```zsh
    ng serve
```

#### Location: app/app.component.css

- COPY: styles from the finished application over.

_RESULT_:

```css
h1 {
  text-align: center;
  margin: 48px auto;
}

h2 {
  margin-bottom: 24px;
  text-align: center;
}

.book {
  box-shadow: 0px 8px 17px 2px rgba(0, 0, 0, 0.14), 0px 3px 14px 2px rgba(0, 0, 0, 0.12),
    0px 5px 5px -3px rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100px;
  padding: 12px 22px;
  margin-bottom: 24px;
}

.book p {
  margin-bottom: 0;
  font-weight: bold;
}

.book button {
  height: 50px;
  min-width: 50px;
  font-size: 1.25rem;
  border-radius: 100%;
}
```

---

### STEP 2: Add Book Model

#### Location: app/shared/book.model.ts

- CREATE: Book interface that matches what we will receive from the api.

_RESULT_:

```typescript
export interface Book {
  id: string
  volumeInfo: {
    title: string
    authors: Array<string>
  }
}
```

---

### STEP 3: Add Book Service (Api Call)

#### Location: app/shared/book.service.ts

- CREATE: Function that creates an Http Request to a hard-coded api url.

_RESULT_:

```typescript
import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { of, Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { Book } from './book.model'

@Injectable({ providedIn: 'root' })
export class GoogleBooksService {
  constructor(private http: HttpClient) {}

  getBooks(): Observable<Array<Book>> {
    return this.http
      .get<{ items: Book[] }>(
        'https://www.googleapis.com/books/v1/volumes?maxResults=5&orderBy=relevance&q=oliver%20sacks'
      )
      .pipe(map((books) => books.items || []))
  }
}
```

---

### STEP 4: Add Book Actions

#### Location: app/state/book.actions.ts

- CREATE: addBook Action.

- CREATE: removeBook Action.

- CREATE: getAllBooks Action.

_RESULT_:

```typescript
import { createAction, props } from '@ngrx/store'

export const addBook = createAction('[Bookshelf] Add Book', props<{ bookId }>())

export const removeBook = createAction(
  '[Bookshelf] Remove Book',
  props<{ bookId }>()
)

export const getAllBooks = createAction(
  '[Library/API] Get All Books',
  props<{ Book }>()
)
```

---

### STEP 5: Add Reducers

#### Location: app/state/bookshelf.reducer.ts

- CREATE: bookshelfReducer function that accounts for both the add and remove book actions and filters by the bookId.

_RESULT_:

```typescript
import { createReducer, on } from '@ngrx/store'
import { addBook, removeBook } from './book.actions'

export const initialState: ReadonlyArray<string> = []

export const bookshelfReducer = createReducer(
  initialState,
  on(removeBook, (state, { bookId }) => state.filter((id) => id !== bookId)),
  on(addBook, (state, { bookId }) => {
    if (state.indexOf(bookId) > -1) return state

    return [...state, bookId]
  })
)
```

#### Location: app/state/library.reducer.ts

- CREATE: libraryReducer that runs when we call the getAllBooks action.

_RESULT_:

```typescript
import { createReducer, on } from '@ngrx/store'
import { getAllBooks } from './book.actions'
import { Book } from '../shared/book.model'

export const initialState: ReadonlyArray<Book> = []

export const libraryReducer = createReducer(
  initialState,
  on(getAllBooks, (state, { Book }) => [...Book])
)
```

---

### STEP 6: Add AppState

#### Location: app/state/app.state.ts

- CREATE: AppState interface to check and make sure the books and bookshelf variables are a read only array.

_RESULT_:

```typescript
import { Book } from '../shared/book.model'

export interface AppState {
  books: ReadonlyArray<Book>
  bookshelf: ReadonlyArray<string>
}
```

---

### STEP 7: Add Selectors

#### Location: app/state/book.selectors.ts

- CREATE: selectAllBooks function.

- CREATE: selectBookshelfState function.

- CREATE: selectBookshelf function.

_RESULT_:

```typescript
import { createSelector, createFeatureSelector } from '@ngrx/store'
import { AppState } from './app.state'
import { Book } from '../shared/book.model'

export const selectAllBooks = createSelector(
  (state: AppState) => state.books,
  (books: Array<Book>) => books
)

export const selectBookshelfState = createFeatureSelector<
  AppState,
  ReadonlyArray<string>
>('bookshelf')

export const selectBookshelf = createSelector(
  selectAllBooks,
  selectBookshelfState,
  (books: Array<Book>, bookshelf: Array<string>) => {
    return bookshelf.map((id) => books.find((book) => book.id === id))
  }
)
```

---

### STEP 8: Add Library

#### Location: app/library (TS && HTML)

- RUN: `ng g c library`

- DELETE: the test and css file and the links to them.

- ADD: an Input() to receive the books and an Output() to emit adding a book in the typescript file.

- ADD: Library book loop and add button.

_RESULT_:

```typescript
import { Component, EventEmitter, Input, Output } from '@angular/core'
import { Book } from '../shared/book.model'

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
})
export class LibraryComponent {
  @Input() books: Array<Book>
  @Output() add = new EventEmitter()
}
```

```html
<h2>The Library</h2>
<div class="book" *ngFor="let book of books">
  <div>
    <p>{{ book.volumeInfo.title }}</p>
    <span> by {{ book.volumeInfo.authors }}</span>
  </div>
  <button
    (click)="add.emit(book.id)"
    data-test="add-button"
    class="btn btn-primary"
  >
    +
  </button>
</div>
```

---

### STEP 9: Add Bookshelf

#### Location: app/bookshelf (TS && HTML)

- RUN: `ng g c bookshelf`

- DELETE: the test and css file and the links to them.

- ADD: an Input() to receive the books and an Output() to emit removing a book in the typescript file.

- ADD: Bookshelf book loop and remove button.

_RESULT_:

```typescript
import { Component, EventEmitter, Input, Output } from '@angular/core'
import { Book } from '../shared/book.model'

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
})
export class LibraryComponent {
  @Input() books: Array<Book>
  @Output() remove = new EventEmitter()
}
```

```html
<h2>My Bookshelf</h2>
<div class="book" *ngFor="let book of books">
  <div>
    <p>{{ book.volumeInfo.title }}</p>
    <span> by {{ book.volumeInfo.authors }}</span>
  </div>
  <button
    (click)="remove.emit(book.id)"
    data-test="remove-button"
    class="btn btn-danger"
  >
    -
  </button>
</div>
```

---

### STEP 10: Display UI

#### Location: app/app.module.ts

- IMPORT: BookshelfComponent, Library Component, bookshelfReducer, libraryReducer, and StoreModule.

- ADD: Both components to the declarations array.

- ADD: The StoreModule.forRoot({}) in the import array with the reducers passed as simpler variables.

_RESULT_:

```typescript
// MODULES
import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { HttpClientModule } from '@angular/common/http'
import { StoreModule } from '@ngrx/store'

// REDUCERS
import { bookshelfReducer } from './state/bookshelf.reducer'
import { libraryReducer } from './state/library.reducer'

// COMPONENTS
import { AppComponent } from './app.component'
import { BookshelfComponent } from './bookshelf/bookshelf.component'
import { LibraryComponent } from './library/library.component'

@NgModule({
  declarations: [AppComponent, BookshelfComponent, LibraryComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    StoreModule.forRoot({ books: libraryReducer, bookshelf: bookshelfReducer }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

#### Location: app/app.component.html

- ADD: A row containing both the library and bookshelf components... pass in their respective bindings and listeners.

_RESULT_:

```html
<div class="container">
  <h1>NgRx Book Demo</h1>

  <div class="row justify-content-between">
    <div class="col-xs-12 col-md-6">
      <app-library
        class="book-list"
        [books]="books$ | async"
        (add)="onAdd($event)"
      ></app-library>
    </div>

    <div class="col-xs-12 col-md-6">
      <app-bookshelf
        class="book-collection"
        [books]="bookshelf$ | async"
        (remove)="onRemove($event)"
      >
      </app-bookshelf>
    </div>
  </div>
</div>
```

#### Location: app/app.component.ts

- CREATE: libary$ and bookshelf$ Observable variable declarations.

- CREATE: onAdd(bookId) && onRemove(bookId) functions that dispatch actions to our reducer functions.

- ADD: ngOnInit function that subscribes to our booksService.getBooks() function so we have the books on initial load.

_RESULT_:

```typescript
import { Component, OnInit } from '@angular/core'
import { Store, select } from '@ngrx/store'
import { GoogleBooksService } from './shared/book.service'
import { addBook, getAllBooks, removeBook } from './state/book.actions'
import { selectAllBooks, selectBookshelf } from './state/book.selectors'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  library$ = this.store.pipe(select(selectAllBooks))
  bookshelf$ = this.store.pipe(select(selectBookshelf))

  onAdd(bookId) {
    this.store.dispatch(addBook({ bookId }))
  }

  onRemove(bookId) {
    this.store.dispatch(removeBook({ bookId }))
  }

  constructor(private booksService: GoogleBooksService, private store: Store) {}

  ngOnInit() {
    this.booksService.getBooks().subscribe((Book) => {
      this.store.dispatch(getAllBooks({ Book }))
    })
  }
}
```

---

---

## Extra Resources

- [NgRx Docs](https://ngrx.io/docs)
- [Why use NgRx](https://stackoverflow.com/questions/49885341/why-use-ngrx-instead-of-constructor-injected-services)
- [Angular University - NgRx Entity Complete Practical Guide](https://blog.angular-university.io/ngrx-entity/)
- [Getting Started with NgRx Guide w/ Examples](https://betterprogramming.pub/angular-getting-started-with-ngrx-75b9139c23eb)
