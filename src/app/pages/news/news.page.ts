import { Component, OnInit, inject, ViewChild } from '@angular/core';
import { addIcons } from 'ionicons';
import { alertCircleOutline, chevronDownCircleOutline, notificationsOutline, newspaperOutline } from 'ionicons/icons';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton,
  IonIcon, IonRefresher, IonRefresherContent, IonCard, IonCardHeader,
  IonCardTitle, IonSkeletonText, ModalController, ToastController,
  IonInfiniteScroll, IonInfiniteScrollContent
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { NewsService, Article } from '../../core/services/news.service';
import { DatePipe } from '@angular/common';
import { NotificationsModal } from '../notifications/notifications.modal';
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';

@Component({
  selector: 'app-news',
  templateUrl: './news.page.html',
  styleUrls: ['./news.page.scss'],
  standalone: true,
  imports: [
    DatePipe,
    IonContent, IonHeader, IonToolbar, IonButtons, IonButton,
    IonIcon, IonRefresher, IonRefresherContent, IonCard, IonCardHeader,
    IonCardTitle, IonSkeletonText,
    IonInfiniteScroll, IonInfiniteScrollContent
  ]
})
export class NewsPage implements OnInit {
  
  @ViewChild(IonContent, { static: false }) content!: IonContent;
  @ViewChild(IonInfiniteScroll) infiniteScroll!: IonInfiniteScroll;

  private newsService = inject(NewsService);
  private router = inject(Router);
  private modalCtrl = inject(ModalController);
  private toastCtrl = inject(ToastController);

  articles: Article[] = [];
  loading = true;
  loadingMore = false; 
  today = new Date();
  page = 1;
  private currentRegion = 'us';
  private pageSize = 5;

  categories = ['General', 'Business', 'Technology', 'Entertainment', 'Health', 'Science', 'Sports'];
  selectedCategory = 'General';

  constructor() {
    addIcons({ alertCircleOutline, chevronDownCircleOutline, notificationsOutline, newspaperOutline });
  }

  ngOnInit() {
    this.currentRegion = this.getRegionCode();
    this.loadNews();
  }

  ionViewWillEnter() {
    const savedRegion = this.getRegionCode();
    
    if (this.currentRegion !== savedRegion) {
      this.currentRegion = savedRegion;
      this.loading = true;
      this.articles = [];
      this.loadNews();
    }
  }

  getRegionCode(): string {
    return localStorage.getItem('le_news_region') || 'us';
  }

  async loadNews(event?: any) {
    if (!event) {
      this.loading = true;
    } else {
      await Haptics.impact({ style: ImpactStyle.Light });
    }

    const region = this.getRegionCode();
    this.page = 1;
    
    if (this.infiniteScroll) {
      this.infiniteScroll.disabled = false;
    }

    this.newsService.getTopHeadlines(region, this.selectedCategory.toLowerCase(), this.page, this.pageSize, !!event).subscribe({
      next: (data) => {
        setTimeout(() => {
          this.articles = data;
          this.loading = false;
          if (event) event.target.complete();
          
          if (data.length < this.pageSize && this.infiniteScroll) {
            this.infiniteScroll.disabled = true;
          }
        }, 1500); 
      },
      error: async (err) => {
        console.error(err);
        
        setTimeout(async () => {
          this.loading = false;
          if (event) event.target.complete();

          await Haptics.notification({ type: NotificationType.Error });

          const toast = await this.toastCtrl.create({
            message: `Error loading news: ${err.message || 'Check connection'}`,
            duration: 4000,
            color: 'danger',
            position: 'bottom',
            icon: 'alert-circle-outline'
          });
          await toast.present();
        }, 1500);
      }
    });
  }

  async loadMoreNews(event: any) {
    await Haptics.impact({ style: ImpactStyle.Light });
    
    this.page++;
    this.loadingMore = true; 
    const region = this.getRegionCode();

    this.newsService.getTopHeadlines(region, this.selectedCategory.toLowerCase(), this.page, this.pageSize, false).subscribe({
      next: (data) => {
        
        setTimeout(() => {
          if (data.length > 0) {
            this.articles = [...this.articles, ...data];
          }
          
          this.loadingMore = false; 
          event.target.complete();

          if (data.length < this.pageSize || this.articles.length >= 100) {
            event.target.disabled = true;
          }
        }, 1500);
      },
      error: async (err) => {
        console.error(err);
        setTimeout(async () => {
          this.loadingMore = false;
          event.target.complete();
          event.target.disabled = true;
          
          await Haptics.notification({ type: NotificationType.Error });
        }, 1500);
      }
    });
  }

  async retryLoading() {
    await Haptics.impact({ style: ImpactStyle.Medium });
    this.loading = true;
    this.articles = [];
    this.loadNews();
  }

  async selectCategory(category: string) {
    await Haptics.impact({ style: ImpactStyle.Light });
    
    
    if (this.content) {
      this.content.scrollToTop(400); 
    }

    this.selectedCategory = category;
    this.loading = true;
    this.articles = [];
    this.loadNews();
  }

  async openDetail(article: Article) {
    await Haptics.impact({ style: ImpactStyle.Medium });
    this.newsService.setCurrentArticle(article);
    this.router.navigate(['/news-detail']);
  }

  async goToProfile() {
    await Haptics.impact({ style: ImpactStyle.Light });
    this.router.navigate(['/tabs/profile']);
  }

  async openNotifications() {
    await Haptics.impact({ style: ImpactStyle.Light });
    const modal = await this.modalCtrl.create({
      component: NotificationsModal,
      breakpoints: [0, 0.5, 0.85],
      initialBreakpoint: 0.85,
      cssClass: 'notifications-modal',
    });
    await modal.present();
  }
}