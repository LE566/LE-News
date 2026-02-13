import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

export interface Article {
  source: { id: string | null; name: string };
  author: string | null;
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string | null;
}

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  private apiKey = environment.apiKey;
  private apiUrl = 'https://newsapi.org/v2/top-headlines';

  private articles: Article[] = [];
  private currentArticleSubject = new BehaviorSubject<Article | null>(null);

  constructor(private http: HttpClient) { }

  getTopHeadlines(country = 'us', category = 'general'): Observable<Article[]> {
    return this.http.get<any>(`${this.apiUrl}?country=${country}&category=${category}&apiKey=${this.apiKey}`).pipe(
      map(response => response.articles),
      tap(articles => {
        this.articles = articles;
      })
    );
  }

  searchNews(query: string): Observable<Article[]> {
    const searchUrl = 'https://newsapi.org/v2/everything';
    return this.http.get<any>(`${searchUrl}?q=${encodeURIComponent(query)}&sortBy=publishedAt&pageSize=20&apiKey=${this.apiKey}`).pipe(
      map(response => response.articles)
    );
  }

  getArticleByTitle(title: string): Article | undefined {
    return this.articles.find(article => article.title === title);
  }

  setCurrentArticle(article: Article) {
    this.currentArticleSubject.next(article);
  }

  getCurrentArticle(): Observable<Article | null> {
    return this.currentArticleSubject.asObservable();
  }
}
