import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import {MyBooksPage} from "../my-books/my-books";
import {HomePage} from "../home/home";
import {MessagesPage} from "../messages/messages";

@IonicPage()
@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html',
})
export class TabsPage {

  allBooks = HomePage;
  myBooks = MyBooksPage;
  messages = MessagesPage

  constructor(){

  }

}
