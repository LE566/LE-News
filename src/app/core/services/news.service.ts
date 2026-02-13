import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { environment } from 'src/environments/environment';

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

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  private apiKey = environment.apiKey;
  private apiUrl = 'https://newsapi.org/v2/top-headlines';

  private articles: Article[] = [];
  private currentArticleSubject = new BehaviorSubject<Article | null>(null);

  private cache = new Map<string, { data: Article[], timestamp: number }>();
  private CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

  constructor(private http: HttpClient) { }

  getTopHeadlines(country = 'us', category = 'general', page = 1, pageSize = 20): Observable<Article[]> {
    const cacheKey = `${country}-${category}-${page}-${pageSize}`;
    const cached = this.cache.get(cacheKey);

    if (cached && (Date.now() - cached.timestamp < this.CACHE_DURATION)) {
      console.log('Returning cached news for:', cacheKey);
      return of(cached.data);
    }

    return this.http.get<any>(`${this.apiUrl}?country=${country}&category=${category}&apiKey=${this.apiKey}&page=${page}&pageSize=${pageSize}`).pipe(
      map(response => {
        if (response.status === 'error') {
          throw new Error(response.message || 'API Error');
        }
        return response.articles || [];
      }),
      tap(articles => {
        this.cache.set(cacheKey, { data: articles, timestamp: Date.now() });
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
