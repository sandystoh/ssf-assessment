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

  // Added Variable for Pagination Console Display only
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

    // fix for: this.limit was getting parsed as a string
    if (typeof(this.limit) !== 'number') {
      this.limit = Number(this.limit);
    }

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
      // If allowed to change html: would add a flag to hide/disable next button so this condition would not occur
    } else {
      this.offset += this.limit;
      this.getBooks();
    }
  }

  previous() {
    if ((this.offset - this.limit) < 0) {
      console.log('Error: Already at first page!');
      alert('Error: Already at first page!');
      // If allowed to change html: would hide/disable previous button if this.offset <= 0 so this condition would not occur
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

  // Added Code for Service call reuse in pagination
  getBooks() {
    const searchCriteria2: SearchCriteria = {
      terms: this.terms,
      limit: this.limit,
      offset: this.offset
    };
    this.bookSvc.getBooks(searchCriteria2)
      .then(result => {
        this.books = result;
        console.log((+this.offset + 1 ) + ' to ' + this.getTop() + ' of ' + this.books.total + ' Books');
      }).catch(error => {
        const errorResponse = error as ErrorResponse;
        alert(`Status: ${errorResponse.status}\nMessage: ${errorResponse.message}`);
      });
  }

  // Added code for Console display purposes only (Pagination progress)
  getTop() {
    if ((+this.offset + +this.limit) >= this.books.total) {
      return this.books.total;
    } else {
      return (+this.offset + +this.limit);
    }
  }

}
