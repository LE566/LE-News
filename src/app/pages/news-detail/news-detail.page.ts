import { Component, OnInit, inject } from '@angular/core';
import { addIcons } from 'ionicons';
import { shareOutline, bookmarkOutline, closeOutline, globeOutline, chevronBackOutline } from 'ionicons/icons';
import {
  IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton,
  IonIcon, IonBackButton, IonAvatar, ToastController
} from '@ionic/angular/standalone';
import { Share } from '@capacitor/share';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { NewsService, Article } from '../../core/services/news.service';
import { BookmarksService } from '../../core/services/bookmarks.service';

@Component({
  selector: 'app-news-detail',
  templateUrl: './news-detail.page.html',
  styleUrls: ['./news-detail.page.scss'],
  standalone: true,
  imports: [
    DatePipe,
    IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton,
    IonIcon, IonBackButton, IonAvatar
  ]
})
export class NewsDetailPage implements OnInit {
  private newsService = inject(NewsService);
  private bookmarksService = inject(BookmarksService);
  private toastCtrl = inject(ToastController);
  private router = inject(Router);

  article = this.newsService.getCurrentArticle();
  isBookmarked = false;

  constructor() {
    addIcons({ shareOutline, bookmarkOutline, closeOutline, globeOutline, chevronBackOutline });
  }

  ngOnInit() {
    const article = this.article();
    if (!article) {
      this.router.navigate(['/tabs/news']);
    } else {
      this.isBookmarked = this.bookmarksService.isBookmarked(article.url);
    }
  }

  async toggleBookmark() {
    const article = this.article();
    if (article) {
      const added = this.bookmarksService.toggle(article);
      this.isBookmarked = added;

      const toast = await this.toastCtrl.create({
        message: added ? 'Article saved' : 'Removed from saved',
        duration: 1500,
        position: 'bottom',
        icon: added ? 'bookmark-outline' : 'close-outline',
      });
      toast.present();
    }
  }

  async shareArticle() {
    const article = this.article();
    if (article) {
      await Share.share({
        title: article.title,
        text: 'Check out this news!',
        url: article.url,
        dialogTitle: 'Share with buddies',
      });
    }
  }

  openOriginal(url: string | undefined) {
    if (url) {
      window.open(url, '_system');
    }
  }
}
