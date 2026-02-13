import { Component, OnInit } from '@angular/core';
import {
  IonContent, IonHeader, IonToolbar, IonTitle, IonIcon, IonButton
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { BookmarksService } from '../../core/services/bookmarks.service';
import { NewsService, Article } from '../../core/services/news.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-bookmarks',
  template: `
    <ion-header class="ion-no-border">
      <ion-toolbar class="main-header">
        <ion-title>Saved Articles</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content [fullscreen]="true" class="bookmarks-content">
      <div class="bookmarks-wrapper ion-padding">

        @if (bookmarks.length > 0) {
          <div class="count-label">
            <ion-icon name="bookmark"></ion-icon>
            <span>{{ bookmarks.length }} saved {{ bookmarks.length === 1 ? 'article' : 'articles' }}</span>
          </div>

          <div class="bookmarks-list">
            @for (article of bookmarks; track article.url; let i = $index) {
              <!-- Featured first article -->
              @if (i === 0) {
                <div class="featured-bookmark" (click)="openArticle(article)">
                  @if (article.urlToImage) {
                    <div class="featured-img">
                      <img [src]="article.urlToImage" loading="lazy"/>
                      <div class="featured-overlay"></div>
                      <div class="featured-content">
                        <span class="featured-source">{{ article.source.name }}</span>
                        <h2>{{ article.title }}</h2>
                        <div class="featured-meta">
                          <span>{{ article.publishedAt | date:'mediumDate' }}</span>
                          @if (article.author) {
                            <span>· {{ article.author }}</span>
                          }
                        </div>
                      </div>
                    </div>
                  }
                  <ion-button fill="clear" size="small" color="light" class="remove-btn"
                    (click)="removeBookmark($event, article.url)">
                    <ion-icon slot="icon-only" name="close-outline"></ion-icon>
                  </ion-button>
                </div>
              } @else {
                <!-- Regular bookmark cards -->
                <div class="bookmark-card" (click)="openArticle(article)">
                  @if (article.urlToImage) {
                    <div class="card-thumb">
                      <img [src]="article.urlToImage" loading="lazy"/>
                    </div>
                  } @else {
                    <div class="card-thumb card-thumb-placeholder">
                      <ion-icon name="newspaper-outline"></ion-icon>
                    </div>
                  }
                  <div class="card-info">
                    <div class="card-source-row">
                      <span class="card-source">{{ article.source.name }}</span>
                      <span class="card-date">{{ article.publishedAt | date:'shortDate' }}</span>
                    </div>
                    <h3>{{ article.title }}</h3>
                    @if (article.description) {
                      <p class="card-desc">{{ article.description }}</p>
                    }
                  </div>
                  <button class="card-remove" (click)="removeBookmark($event, article.url)">
                    <ion-icon name="close-outline"></ion-icon>
                  </button>
                </div>
              }
            }
          </div>
        } @else {
          <div class="empty-state">
            <div class="empty-visual">
              <div class="empty-circle c1"></div>
              <div class="empty-circle c2"></div>
              <div class="empty-icon">
                <ion-icon name="bookmark-outline"></ion-icon>
              </div>
            </div>
            <h3>No saved articles yet</h3>
            <p>Tap the bookmark icon on any article to save it here for later reading</p>
            <ion-button fill="outline" size="small" (click)="goToFeed()">
              <ion-icon name="newspaper-outline" slot="start"></ion-icon>
              Browse News
            </ion-button>
          </div>
        }

      </div>
    </ion-content>
  `,
  styles: [`
    .bookmarks-content {
      --background: var(--ion-color-step-50, #F0F1F6);

      @media (prefers-color-scheme: dark) {
        --background: #0F172A;
      }
    }

    :host-context(.dark) .bookmarks-content {
      --background: #0F172A;
    }

    :host-context(.light) .bookmarks-content {
      --background: #F0F1F6;
    }

    .main-header {
      --background: rgba(255, 255, 255, 0.95);
      --border-style: none;
      backdrop-filter: blur(20px);

      @media (prefers-color-scheme: dark) {
        --background: rgba(15, 23, 42, 0.95);
      }

      ion-title {
        font-family: 'Inter', sans-serif;
        font-weight: 800;
        font-size: 1.3rem;
      }
    }

    :host-context(.dark) .main-header {
      --background: rgba(15, 23, 42, 0.95);
    }

    :host-context(.light) .main-header {
      --background: rgba(255, 255, 255, 0.95);
    }

    .bookmarks-wrapper {
      padding-bottom: 40px;
    }

    .count-label {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 4px 18px;

      ion-icon {
        font-size: 1.1rem;
        color: var(--ion-color-primary);
      }

      span {
        font-family: 'Inter', sans-serif;
        font-size: var(--le-small-size, 0.78rem);
        font-weight: 700;
        color: var(--ion-color-medium);
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
    }

    /* Featured first bookmark */
    .featured-bookmark {
      position: relative;
      border-radius: 24px;
      overflow: hidden;
      margin-bottom: 16px;
      cursor: pointer;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);

      &:active {
        transform: scale(0.98);
        transition: transform 0.2s;
      }

      .featured-img {
        position: relative;
        height: 240px;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .featured-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 70%;
          background: linear-gradient(transparent, rgba(0, 0, 0, 0.85));
        }

        .featured-content {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 20px;

          .featured-source {
            font-family: 'Inter', sans-serif;
            font-size: 0.68rem;
            font-weight: 800;
            color: var(--ion-color-primary-tint);
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 8px;
            display: block;
          }

          h2 {
            font-family: 'Inter', sans-serif;
            font-size: var(--le-title-size, 1.1rem);
            font-weight: 800;
            color: white;
            margin: 0 0 8px;
            line-height: 1.3;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }

          .featured-meta {
            font-size: 0.75rem;
            color: rgba(255, 255, 255, 0.65);
            font-weight: 500;

            span + span {
              margin-left: 4px;
            }
          }
        }
      }

      .remove-btn {
        position: absolute;
        top: 8px;
        right: 8px;
        z-index: 2;
        --padding-start: 6px;
        --padding-end: 6px;
        backdrop-filter: blur(10px);
        --background: rgba(0, 0, 0, 0.3);
        --border-radius: 12px;
      }
    }

    /* Regular bookmark cards */
    .bookmark-card {
      display: flex;
      background: var(--ion-background-color);
      border-radius: 20px;
      overflow: hidden;
      margin-bottom: 12px;
      cursor: pointer;
      position: relative;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
      border: 1px solid rgba(0, 0, 0, 0.03);

      &:active {
        transform: scale(0.98);
        transition: transform 0.2s;
      }

      .card-thumb {
        width: 120px;
        min-height: 120px;
        flex-shrink: 0;
        overflow: hidden;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        &.card-thumb-placeholder {
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(var(--ion-color-primary-rgb), 0.06);

          ion-icon {
            font-size: 2rem;
            color: var(--ion-color-primary);
            opacity: 0.3;
          }
        }
      }

      .card-info {
        flex: 1;
        padding: 14px 40px 14px 16px;
        display: flex;
        flex-direction: column;
        justify-content: center;

        .card-source-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 6px;

          .card-source {
            font-family: 'Inter', sans-serif;
            font-size: 0.65rem;
            font-weight: 800;
            color: var(--ion-color-primary);
            text-transform: uppercase;
            letter-spacing: 0.5px;
            background: rgba(var(--ion-color-primary-rgb), 0.08);
            padding: 2px 8px;
            border-radius: 6px;
          }

          .card-date {
            font-size: var(--le-small-size, 0.72rem);
            color: var(--ion-color-medium);
          }
        }

        h3 {
          font-family: 'Inter', sans-serif;
          font-size: var(--le-card-title-size, 0.95rem);
          font-weight: 700;
          line-height: 1.3;
          margin: 0 0 4px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          color: var(--ion-text-color);
        }

        .card-desc {
          font-size: var(--le-small-size, 0.78rem);
          color: var(--ion-color-medium);
          line-height: 1.3;
          margin: 0;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      }

      .card-remove {
        position: absolute;
        top: 8px;
        right: 8px;
        width: 28px;
        height: 28px;
        border-radius: 8px;
        border: none;
        background: rgba(var(--ion-color-danger-rgb), 0.08);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2;

        ion-icon {
          font-size: 16px;
          color: var(--ion-color-danger);
        }

        &:active {
          background: rgba(var(--ion-color-danger-rgb), 0.2);
        }
      }
    }

    /* Empty state */
    .empty-state {
      text-align: center;
      padding: 60px 20px 40px;

      .empty-visual {
        position: relative;
        width: 120px;
        height: 120px;
        margin: 0 auto 28px;
        display: flex;
        align-items: center;
        justify-content: center;

        .empty-circle {
          position: absolute;
          border-radius: 50%;

          &.c1 {
            width: 120px;
            height: 120px;
            background: rgba(var(--ion-color-primary-rgb), 0.04);
            animation: pulse 3s ease-in-out infinite;
          }

          &.c2 {
            width: 88px;
            height: 88px;
            background: rgba(var(--ion-color-primary-rgb), 0.08);
            animation: pulse 3s ease-in-out infinite 0.5s;
          }
        }

        .empty-icon {
          position: relative;
          z-index: 1;
          width: 64px;
          height: 64px;
          background: linear-gradient(145deg, #4F46E5, #7C3AED);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 24px rgba(79, 70, 229, 0.3);

          ion-icon {
            font-size: 28px;
            color: white;
          }
        }
      }

      @keyframes pulse {
        0%, 100% { transform: scale(1); opacity: 1; }
        50% { transform: scale(1.05); opacity: 0.6; }
      }

      h3 {
        font-family: 'Inter', sans-serif;
        font-size: 1.2rem;
        font-weight: 800;
        margin: 0 0 8px;
        color: var(--ion-text-color);
        letter-spacing: -0.3px;
      }

      p {
        font-size: var(--le-body-size, 0.9rem);
        color: var(--ion-color-medium);
        max-width: 260px;
        margin: 0 auto 24px;
        line-height: 1.5;
      }

      ion-button {
        --border-radius: 14px;
        font-weight: 700;
        font-size: 0.85rem;
      }
    }
  `],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonToolbar, IonTitle, IonIcon, IonButton, DatePipe
  ]
})
export class BookmarksPage implements OnInit {
  bookmarks: Article[] = [];

  constructor(
    private bookmarksService: BookmarksService,
    private newsService: NewsService,
    private router: Router
  ) { }

  ngOnInit() {
    this.bookmarksService.bookmarks.subscribe(data => {
      this.bookmarks = data;
    });
  }

  openArticle(article: Article) {
    this.newsService.setCurrentArticle(article);
    this.router.navigate(['/news-detail']);
  }

  removeBookmark(event: Event, url: string) {
    event.stopPropagation();
    this.bookmarksService.remove(url);
  }

  goToFeed() {
    this.router.navigate(['/tabs/news']);
  }
}
