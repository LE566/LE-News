import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton,
  IonIcon, IonRefresher, IonRefresherContent, IonCard, IonCardHeader,
  IonCardTitle, IonSkeletonText, ModalController, ToastController
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
    IonCardTitle, IonSkeletonText
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

  async loadNews(event?: any) {
    if (!event) {
      this.loading = true;
    }

    const region = this.getRegionCode();

    // Always reset page on load since we removed pagination
    this.page = 1;

    this.newsService.getTopHeadlines(region, this.selectedCategory.toLowerCase(), this.page, 20, !!event).subscribe({
      next: (data) => {
        this.articles = data;
        this.loading = false;
        if (event) event.target.complete();
      },
      error: async (err) => {
        console.error(err);
        this.loading = false;
        if (event) event.target.complete();

        const toast = await this.toastCtrl.create({
          message: `Error loading news: ${err.message || 'Check connection'}`,
          duration: 4000,
          color: 'danger',
          position: 'bottom',
          icon: 'alert-circle-outline'
        });
        await toast.present();
      }
    });
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
