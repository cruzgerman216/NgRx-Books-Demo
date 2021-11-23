import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DataStorageService {
  constructor(private http: HttpClient) {}
  getBooks(bookTitle: String) {
    return this.http
      .get(
        `https://www.googleapis.com/books/v1/volumes?maxResults=5&orderBy=relevance&q=${bookTitle}`
      )
      .pipe(
        map((data: any) => {
          return data.items.map((book) => {
            return {
              id: book.id,
              volumeInfo: {
                authors: [book.volumeInfo.authors],
                title: book.volumeInfo.title,
              },
            };
          });
        })
      );
    // get request to this public api
  }
}
