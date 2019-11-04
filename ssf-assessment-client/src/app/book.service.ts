import { Injectable } from '@angular/core';
import { SearchCriteria, BooksResponse, BookResponse } from './models';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../environments/environment';

const API_URL = environment.API_URL;  // '/api/'

@Injectable()
export class BookService {
  constructor(private http: HttpClient) { }

  getBooks(searchCriteria: SearchCriteria): Promise<BooksResponse> {
    // GET /api/search?terms=love&limit=10&offset=0
      const s = searchCriteria;
      const offset = s.offset || 0;
      const headers = new HttpHeaders().set('Accept', 'application/json');
      const params = new HttpParams().append('terms', s.terms).append('limit', s.limit.toString()).append('offset', offset.toString());
      return this.http.get<BooksResponse>(API_URL + 'search', { headers, params }).toPromise();
  }

  getBook(bookId: string): Promise<BookResponse> {
    // TODO - for Task 5
    return (null);
  }
}
