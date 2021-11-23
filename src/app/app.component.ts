import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { DataStorageService } from './shared/data-storage.service';
import { setAPIBooks } from './state/books.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  constructor(private dataStorageService:DataStorageService, private store:Store){}

  ngOnInit(){
    this.dataStorageService.getBooks("Harry").subscribe(data=> {
      console.log("data", data)
      this.store.dispatch(setAPIBooks({books:data}))
    })
  }
}
