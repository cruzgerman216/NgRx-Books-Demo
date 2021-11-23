import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LibraryComponent } from './library/library.component';
import { BookshelfComponent } from './bookshelf/bookshelf.component';
import { StoreModule } from '@ngrx/store';
import { bookshelfReducer } from './state/bookshelf.reducer';
import { LibraryReducer } from './state/library.reducer';

@NgModule({
  declarations: [
    AppComponent,
    LibraryComponent,
    BookshelfComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    StoreModule.forRoot({
      bookshelf: bookshelfReducer,
      library: LibraryReducer
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
