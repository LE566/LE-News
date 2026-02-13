import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Article } from './news.service';

@Injectable({ providedIn: 'root' })
export class BookmarksService {
    private bookmarksKey = 'le_news_bookmarks';
    private bookmarks$ = new BehaviorSubject<Article[]>(this.loadBookmarks());

    get bookmarks() {
        return this.bookmarks$.asObservable();
    }

    private loadBookmarks(): Article[] {
        try {
            const data = localStorage.getItem(this.bookmarksKey);
            return data ? JSON.parse(data) : [];
        } catch {
            return [];
        }
    }

    private save(articles: Article[]) {
        localStorage.setItem(this.bookmarksKey, JSON.stringify(articles));
        this.bookmarks$.next(articles);
    }

    isBookmarked(url: string): boolean {
        return this.bookmarks$.value.some(a => a.url === url);
    }

    toggle(article: Article): boolean {
        const current = this.bookmarks$.value;
        const exists = current.findIndex(a => a.url === article.url);

        if (exists > -1) {
            current.splice(exists, 1);
            this.save([...current]);
            return false; // removed
        } else {
            this.save([article, ...current]);
            return true; // added
        }
    }

    remove(url: string) {
        const current = this.bookmarks$.value.filter(a => a.url !== url);
        this.save(current);
    }

    getCount(): number {
        return this.bookmarks$.value.length;
    }
}
