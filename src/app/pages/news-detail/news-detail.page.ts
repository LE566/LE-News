import { Component, OnInit } from '@angular/core';
import {
  IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton,
  IonIcon, IonBackButton, IonAvatar, ToastController
} from '@ionic/angular/standalone';
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
  article: Article | null = null;
  isBookmarked = false;

  constructor(
    private newsService: NewsService,
    private bookmarksService: BookmarksService,
    private toastCtrl: ToastController,
    private router: Router
  ) { }

  ngOnInit() {
    this.newsService.getCurrentArticle().subscribe(article => {
      if (!article) {
        this.router.navigate(['/tabs/news']);
      } else {
        this.article = article;
        this.isBookmarked = this.bookmarksService.isBookmarked(article.url);
      }
    });
  }

  async toggleBookmark() {
    if (this.article) {
      const added = this.bookmarksService.toggle(this.article);
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

  openOriginal(url: string) {
    if (url) {
      window.open(url, '_blank');
    }
  }
}
