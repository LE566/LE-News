import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton,
  IonIcon, IonRefresher, IonRefresherContent, IonCard, IonCardHeader,
  IonCardTitle, IonSkeletonText, ModalController, IonInfiniteScroll, IonInfiniteScrollContent, ToastController
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { NewsService, Article } from '../../core/services/news.service';
import { DatePipe } from '@angular/common';
import { NotificationsModal } from '../notifications/notifications.modal';

@Component({
  selector: 'app-news',
  templateUrl: './news.page.html',
  styleUrls: ['./news.page.scss'],
  standalone: true,
  imports: [
    DatePipe,
    IonContent, IonHeader, IonToolbar, IonButtons, IonButton,
    IonIcon, IonRefresher, IonRefresherContent, IonCard, IonCardHeader,
    IonCardTitle, IonSkeletonText, IonInfiniteScroll, IonInfiniteScrollContent
  ]
})
export class NewsPage implements OnInit {
  articles: Article[] = [];
  loading = true;
  today = new Date();
  page = 1;

  categories = ['General', 'Business', 'Technology', 'Entertainment', 'Health', 'Science', 'Sports'];
  selectedCategory = 'General';

  constructor(
    private newsService: NewsService,
    private router: Router,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController
  ) { }

  ngOnInit() {
    this.loadNews();
  }

  getRegionCode(): string {
    return localStorage.getItem('le_news_region') || 'us';
  }

  async loadNews(event?: any, isInfinite: boolean = false) {
    if (!event) {
      this.loading = true;
    }

    const region = this.getRegionCode();

    // Reset page on refresh or category change (not infinite scroll)
    if (!isInfinite) {
      this.page = 1;
    }

    this.newsService.getTopHeadlines(region, this.selectedCategory.toLowerCase(), this.page).subscribe({
      next: (data) => {
        // Allow articles without images, handled in template
        const newArticles = data;

        if (this.page === 1) {
          this.articles = newArticles;
        } else {
          this.articles.push(...newArticles);
        }

        this.loading = false;
        if (event) event.target.complete();

        // Disable infinite scroll if no more data
        if (isInfinite && newArticles.length === 0 && event) {
          event.target.disabled = true;
        }
      },
      error: async (err) => {
        console.error(err);
        this.loading = false;
        if (event) event.target.complete();

        const toast = await this.toastCtrl.create({
          message: 'Could not load news. Check your connection',
          duration: 3000,
          color: 'danger',
          position: 'bottom',
          icon: 'alert-circle-outline'
        });
        await toast.present();
      }
    });
  }

  loadMore(event: any) {
    this.page++;
    this.loadNews(event, true);
  }

  selectCategory(category: string) {
    this.selectedCategory = category;
    this.loading = true;
    this.articles = [];
    this.loadNews();
  }

  openDetail(article: Article) {
    this.newsService.setCurrentArticle(article);
    this.router.navigate(['/news-detail']);
  }

  goToProfile() {
    this.router.navigate(['/tabs/profile']);
  }

  async openNotifications() {
    const modal = await this.modalCtrl.create({
      component: NotificationsModal,
      breakpoints: [0, 0.5, 0.85],
      initialBreakpoint: 0.85,
      cssClass: 'notifications-modal',
    });
    await modal.present();
  }
}
