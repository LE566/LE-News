import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonHeader, IonToolbar, IonSearchbar, IonIcon, IonCard, IonCardHeader,
  IonCardTitle, IonSpinner
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { NewsService, Article } from '../../core/services/news.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-search',
  template: `
    <ion-header class="ion-no-border">
      <ion-toolbar class="main-header">
        <ion-searchbar
          [(ngModel)]="searchQuery"
          placeholder="Search news..."
          (ionInput)="onSearch()"
          [debounce]="500"
          class="custom-searchbar"
          animated="true"
          show-clear-button="focus">
        </ion-searchbar>
      </ion-toolbar>
    </ion-header>

    <ion-content [fullscreen]="true" class="search-content">
      <div class="search-wrapper ion-padding">

        <!-- Initial State -->
        @if (!searched && !searching) {
          <div class="initial-state">
            <div class="initial-icon">
              <ion-icon name="search-outline"></ion-icon>
            </div>
            <h3>Discover stories</h3>
            <p>Search across thousands of news sources worldwide</p>

            <div class="suggestions">
              <span class="suggestion-title">Trending topics</span>
              <div class="suggestion-chips">
                @for (topic of trendingTopics; track topic) {
                  <div class="topic-chip" (click)="searchTopic(topic)">
                    {{ topic }}
                  </div>
                }
              </div>
            </div>
          </div>
        }

        <!-- Loading -->
        @if (searching) {
          <div class="loading-state">
            <ion-spinner name="crescent" color="primary"></ion-spinner>
            <p>Searching...</p>
          </div>
        }

        <!-- Results -->
        @if (searched && !searching && results.length > 0) {
          <div class="results-label">
            <span>{{ results.length }} results for "{{ lastQuery }}"</span>
          </div>

          <div class="results-grid">
            @for (article of results; track article.url) {
              <ion-card class="result-card" (click)="openArticle(article)">
                @if (article.urlToImage) {
                  <div class="card-image-wrapper">
                    <img [src]="article.urlToImage" loading="lazy"/>
                  </div>
                }
                <ion-card-header>
                  <div class="source-row">
                    <span class="source-tag">{{ article.source.name }}</span>
                    <span class="time-tag">{{ article.publishedAt | date:'shortDate' }}</span>
                  </div>
                  <ion-card-title>{{ article.title }}</ion-card-title>
                </ion-card-header>
              </ion-card>
            }
          </div>
        }

        <!-- No Results -->
        @if (searched && !searching && results.length === 0) {
          <div class="empty-state">
            <div class="empty-icon-wrapper">
              <ion-icon name="search-outline"></ion-icon>
            </div>
            <h3>No results found</h3>
            <p>Try different keywords or browse trending topics</p>
          </div>
        }

      </div>
    </ion-content>
  `,
  styles: [`
    ion-content {
      --background: #F0F1F6;

      @media (prefers-color-scheme: dark) {
        --background: #0F172A;
      }
    }

    :host-context(.dark) ion-content {
      --background: #0F172A;
    }

    :host-context(.light) ion-content {
      --background: #F0F1F6;
    }

    .main-header {
      --background: rgba(255, 255, 255, 0.95);
      --border-style: none;
      backdrop-filter: blur(20px);
      --padding-start: 12px;
      --padding-end: 12px;

      @media (prefers-color-scheme: dark) {
        --background: rgba(15, 23, 42, 0.95);
      }
    }

    :host-context(.dark) .main-header {
      --background: rgba(15, 23, 42, 0.95);
    }

    :host-context(.light) .main-header {
      --background: rgba(255, 255, 255, 0.95);
    }

    .custom-searchbar {
      --background: var(--ion-color-step-50, #f0f0f0);
      --border-radius: 16px;
      --box-shadow: none;
      --placeholder-opacity: 0.5;
      font-family: 'Inter', sans-serif;
      font-weight: 500;
      --icon-color: var(--ion-color-medium);
      padding: 4px 0;
    }

    .search-wrapper {
      padding-bottom: 40px;
    }

    .initial-state {
      text-align: center;
      padding: 50px 20px;

      .initial-icon {
        width: 80px;
        height: 80px;
        background: rgba(var(--ion-color-primary-rgb), 0.08);
        border-radius: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 20px;

        ion-icon {
          font-size: 2.5rem;
          color: var(--ion-color-primary);
        }
      }

      h3 {
        font-size: 1.3rem;
        font-weight: 800;
        margin: 0 0 8px;
        letter-spacing: -0.3px;
      }

      p {
        font-size: 0.9rem;
        color: var(--ion-color-medium);
        margin: 0 0 32px;
      }

      .suggestions {
        text-align: left;

        .suggestion-title {
          font-family: 'Inter', sans-serif;
          font-size: 0.78rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          color: var(--ion-color-medium);
          padding-left: 4px;
        }

        .suggestion-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 12px;
        }

        .topic-chip {
          padding: 10px 18px;
          background: var(--ion-background-color);
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
          color: var(--ion-text-color);

          &:active {
            transform: scale(0.95);
            background: var(--ion-color-primary);
            color: white;
          }
        }
      }
    }

    .loading-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 80px 20px;
      gap: 12px;

      p {
        font-size: 0.9rem;
        color: var(--ion-color-medium);
      }
    }

    .results-label {
      padding: 10px 5px 16px;

      span {
        font-family: 'Inter', sans-serif;
        font-size: 0.85rem;
        font-weight: 600;
        color: var(--ion-color-medium);
      }
    }

    .results-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 12px;

      @media (min-width: 600px) {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    .result-card {
      margin: 0;
      border-radius: 18px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
      overflow: hidden;
      cursor: pointer;
      border: 1px solid rgba(0, 0, 0, 0.04);

      &:active {
        transform: scale(0.98);
        transition: transform 0.2s;
      }

      .card-image-wrapper {
        height: 160px;
        overflow: hidden;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }

      ion-card-header {
        padding: 14px 16px 16px;

        .source-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;

          .source-tag {
            font-size: 0.68rem;
            font-weight: 700;
            color: var(--ion-color-primary);
            text-transform: uppercase;
            letter-spacing: 0.5px;
            background: rgba(var(--ion-color-primary-rgb), 0.08);
            padding: 3px 7px;
            border-radius: 6px;
          }

          .time-tag {
            font-size: 0.72rem;
            color: var(--ion-color-medium);
          }
        }

        ion-card-title {
          font-size: 0.95rem;
          font-weight: 700;
          line-height: 1.35;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      }
    }

    .empty-state {
      text-align: center;
      padding: 80px 20px;

      .empty-icon-wrapper {
        width: 80px;
        height: 80px;
        background: rgba(var(--ion-color-primary-rgb), 0.08);
        border-radius: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 20px;
      }

      ion-icon {
        font-size: 2.5rem;
        color: var(--ion-color-primary);
        opacity: 0.6;
      }

      h3 {
        font-size: 1.15rem;
        font-weight: 700;
        margin: 0 0 8px;
      }

      p {
        font-size: 0.9rem;
        color: var(--ion-color-medium);
      }
    }
  `],
  standalone: true,
  imports: [
    FormsModule, DatePipe,
    IonContent, IonHeader, IonToolbar, IonSearchbar, IonIcon, IonCard, IonCardHeader,
    IonCardTitle, IonSpinner
  ]
})
export class SearchPage {
  searchQuery = '';
  results: Article[] = [];
  searching = false;
  searched = false;
  lastQuery = '';

  trendingTopics = ['Technology', 'Climate', 'AI', 'Sports', 'Finance', 'Health', 'Space', 'Politics'];

  constructor(
    private newsService: NewsService,
    private router: Router
  ) { }

  onSearch() {
    const query = this.searchQuery.trim();
    if (!query || query.length < 2) {
      this.searched = false;
      this.results = [];
      return;
    }
    this.searching = true;
    this.lastQuery = query;

    this.newsService.searchNews(query).subscribe({
      next: (data) => {
        this.results = data.filter(a => a.urlToImage);
        this.searching = false;
        this.searched = true;
      },
      error: () => {
        this.results = [];
        this.searching = false;
        this.searched = true;
      }
    });
  }

  searchTopic(topic: string) {
    this.searchQuery = topic;
    this.onSearch();
  }

  openArticle(article: Article) {
    this.newsService.setCurrentArticle(article);
    this.router.navigate(['/news-detail']);
  }
}
