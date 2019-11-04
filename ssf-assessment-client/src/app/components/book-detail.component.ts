import { Component, OnInit } from '@angular/core';
import { BookService } from '../book.service';
import { ActivatedRoute } from '@angular/router';
import { BookResponse, Book, ReviewResponse, Review } from '../models';
import { Location } from '@angular/common';

@Component({
  selector: 'app-book-detail',
  templateUrl: './book-detail.component.html',
  styleUrls: ['./book-detail.component.css']
})
export class BookDetailComponent implements OnInit {

  bookId = '';
  book: BookResponse;
  b: Book;
  review: ReviewResponse;
  reviews: Review[];
  isLoading = true;

  constructor(private bookSvc: BookService, private route: ActivatedRoute,
              private location: Location) { }

  ngOnInit() {
    this.isLoading = true;
    this.route.params.subscribe(params => {
      this.bookId = params.id;
      this.bookSvc.getBook(this.bookId).then(r => {
        this.book = r as BookResponse;
        this.b = this.book.data;
      }).then(() => {
        this.bookSvc.getReview(this.bookId).then( v => {
          this.review = v as ReviewResponse;
          this.reviews = this.review.data;
          this.isLoading = false;
        });
      }).catch (e => {
        console.log('error: ', e);
        this.isLoading = false;
      });

    });
  }

}
