import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BookService } from '../book.service';
import { SearchCriteria, ErrorResponse, BooksResponse } from '../models';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css']
})
export class BookListComponent implements OnInit {

  limit = 10;
  offset = 0;
  terms = '';

  // Added Code for Pagination Console Display only
  top = 0;

  books: BooksResponse = null;

  constructor(private router: Router, private activatedRoute: ActivatedRoute,
              private bookSvc: BookService) { }

  ngOnInit() {
    const state = window.history.state;
    if (!state['terms']) {
      return this.router.navigate(['/']);
    }

    this.terms = state.terms;
    this.limit = state.limit || 10;

    const searchCriterial: SearchCriteria = {
      terms: this.terms,
      limit: this.limit
    };
    this.bookSvc.getBooks(searchCriterial)
      .then(result => {
        this.books = result;
      }).catch(error => {
        const errorResponse = error as ErrorResponse;
        alert(`Status: ${errorResponse.status}\nMessage: ${errorResponse.message}`);
      });
  }

  next() {
    if ((this.offset + this.limit) >= this.books.total) {
      console.log('Error: No more books to get!');
      alert('Error: No more books to get!');
    } else {
      this.offset += this.limit;
      this.getBooks();
    }
  }

  previous() {
    if ((this.offset - this.limit) < 0) {
      console.log('Error: Already at first page!');
      alert('Error: Already at first page!');
    } else {
      this.offset -= this.limit;
      this.getBooks();
    }
  }

  bookDetails(bookId: string) {
    console.log('Book id: ', bookId);
    this.router.navigate(['/book/' + bookId]);
  }

  back() {
    this.router.navigate(['/']);
  }

  // Added Code for pagination reuse
  getBooks() {
    const searchCriteria2: SearchCriteria = {
      terms: this.terms,
      limit: this.limit,
      offset: this.offset
    };
    this.bookSvc.getBooks(searchCriteria2)
      .then(result => {
        this.books = result;
        console.log((this.offset + 1 ) + ' to ' + this.getTop() + ' of ' + this.books.total + ' Books');
      }).catch(error => {
        const errorResponse = error as ErrorResponse;
        alert(`Status: ${errorResponse.status}\nMessage: ${errorResponse.message}`);
      });
  }

  // Added code for Console Pagination display purposes only
  getTop() {
    if ((this.offset + this.limit) >= this.books.total) {
      return this.books.total;
    } else {
      return (this.offset + this.limit);
    }
  }

}
