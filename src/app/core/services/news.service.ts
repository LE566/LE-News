import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, tap, switchMap } from 'rxjs/operators';
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
  private fallbackUrl = 'https://newsapi.org/v2/everything';

  private articles: Article[] = [];
  private currentArticleSignal = signal<Article | null>(null);

  private cache = new Map<string, { data: Article[], timestamp: number }>();
  private CACHE_DURATION = 10 * 60 * 1000;

  constructor(private http: HttpClient) { }

  private getLanguageForCountry(country: string): string {
    const langMap: { [key: string]: string } = {
      us: 'en', gb: 'en', ca: 'en',
      mx: 'es', es: 'es', ar: 'es',
      de: 'de', fr: 'fr', br: 'pt'
    };
    return langMap[country] || 'en';
  }

  getTopHeadlines(country = 'us', category = 'general', page = 1, pageSize = 20, forceRefresh = false): Observable<Article[]> {
    const cacheKey = `${country}-${category}-${page}-${pageSize}`;
    const cached = this.cache.get(cacheKey);

    if (!forceRefresh && cached && (Date.now() - cached.timestamp < this.CACHE_DURATION)) {
      return of(cached.data);
    }

    return this.http.get<any>(`${this.apiUrl}?country=${country}&category=${category}&apiKey=${this.apiKey}&page=${page}&pageSize=${pageSize}`).pipe(
      switchMap(response => {
        if (response.status === 'error') {
          throw new Error(response.message || 'API Error');
        }
        
        const articles = response.articles || [];

        if (articles.length === 0) {
          const lang = this.getLanguageForCountry(country);
          const query = category === 'general' ? 'noticias OR news' : category;
          
          // ✨ Aquí está la corrección: Agregamos &page=${page} a esta URL
          return this.http.get<any>(`${this.fallbackUrl}?q=${encodeURIComponent(query)}&language=${lang}&sortBy=publishedAt&page=${page}&pageSize=${pageSize}&apiKey=${this.apiKey}`).pipe(
            map(fallbackRes => fallbackRes.articles || [])
          );
        }

        return of(articles);
      }),
      tap(articles => {
        if (articles.length > 0) {
          this.cache.set(cacheKey, { data: articles, timestamp: Date.now() });
        }
      })
    );
  }

  searchNews(query: string): Observable<Article[]> {
    return this.http.get<any>(`${this.fallbackUrl}?q=${encodeURIComponent(query)}&sortBy=publishedAt&pageSize=20&apiKey=${this.apiKey}`).pipe(
      map(response => response.articles)
    );
  }

  getArticleByTitle(title: string): Article | undefined {
    return this.articles.find(article => article.title === title);
  }

  setCurrentArticle(article: Article) {
    this.currentArticleSignal.set(article);
  }

  getCurrentArticle() {
    return this.currentArticleSignal.asReadonly();
  }
}