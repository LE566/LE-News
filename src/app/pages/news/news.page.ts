import { Component, OnInit, inject } from '@angular/core';
import { addIcons } from 'ionicons';
import { alertCircleOutline } from 'ionicons/icons';
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

// Importamos Capacitor Haptics
import { Haptics, ImpactStyle } from '@capacitor/haptics';

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
  private newsService = inject(NewsService);
  private router = inject(Router);
  private modalCtrl = inject(ModalController);
  private toastCtrl = inject(ToastController);

  articles: Article[] = [];
  loading = true;
  today = new Date();
  page = 1;

  categories = ['General', 'Business', 'Technology', 'Entertainment', 'Health', 'Science', 'Sports'];
  selectedCategory = 'General';

  constructor() {
    addIcons({ alertCircleOutline });
  }

  ngOnInit() {
    this.loadNews();
  }

  getRegionCode(): string {
    return localStorage.getItem('le_news_region') || 'us';
  }

  async loadNews(event?: any) {
    if (!event) {
      this.loading = true;
    } else {
      // ✨ Haptic ligero cuando el usuario hace pull-to-refresh
      await Haptics.impact({ style: ImpactStyle.Light });
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

  // Convertimos a async para usar await con Haptics
  async selectCategory(category: string) {
    // Haptic ligero al tocar un chip de categoría
    await Haptics.impact({ style: ImpactStyle.Light });

    this.selectedCategory = category;
    this.loading = true;
    this.articles = [];
    this.loadNews();
  }

  // Convertimos a async para usar await con Haptics
  async openDetail(article: Article) {
    // Haptic medio al entrar a leer un artículo
    await Haptics.impact({ style: ImpactStyle.Medium });

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