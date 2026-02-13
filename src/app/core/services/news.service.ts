import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; // Keep for now if used elsewhere, but we are replacing usage
import { BehaviorSubject, Observable, of, from } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { CapacitorHttp, HttpResponse } from '@capacitor/core';

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

  getTopHeadlines(country = 'us', category = 'general', page = 1, pageSize = 20, forceRefresh = false): Observable<Article[]> {
    const cacheKey = `${country}-${category}-${page}-${pageSize}`;
    const cached = this.cache.get(cacheKey);

    if (!forceRefresh && cached && (Date.now() - cached.timestamp < this.CACHE_DURATION)) {
      console.log('Returning cached news for:', cacheKey);
      return of(cached.data);
    }

    const options = {
      url: `${this.apiUrl}`,
      headers: {
        'X-Api-Key': this.apiKey,
        'Content-Type': 'application/json'
        // 'User-Agent': 'NewsApp/1.0.0' // CapacitorHttp might handle this, but explicit header helps
      },
      params: {
        country,
        category,
        // apiKey: this.apiKey, // Removed from params, using header
        page: page.toString(),
        pageSize: pageSize.toString()
      }
    };

    // Use CapacitorHttp to bypass CORS and browser restrictions
    return from(CapacitorHttp.get(options)).pipe(
      map((response: HttpResponse) => {
        if (response.status !== 200) {
          // Log the full error data to help debugging
          console.error('API Error Data:', response.data);
          throw new Error(response.data.message || `API Error: ${response.status}`);
        }
        return response.data.articles || [];
      }),
      tap(articles => {
        // Only cache if we got results
        if (articles.length > 0) {
          this.cache.set(cacheKey, { data: articles, timestamp: Date.now() });
        }
      })
    );
  }

  searchNews(query: string): Observable<Article[]> {
    const searchUrl = 'https://newsapi.org/v2/everything';

    const options = {
      url: searchUrl,
      headers: {
        'X-Api-Key': this.apiKey,
        'Content-Type': 'application/json'
      },
      params: {
        q: query,
        sortBy: 'publishedAt',
        pageSize: '20'
        // apiKey: this.apiKey
      }
    };

    return from(CapacitorHttp.get(options)).pipe(
      map((response: HttpResponse) => {
        if (response.status !== 200) {
          console.error('API Error Data:', response.data);
          throw new Error(response.data.message || `API Error: ${response.status}`);
        }
        return response.data.articles || [];
      })
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
