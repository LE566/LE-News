import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth-guard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'tabs',
        pathMatch: 'full'
    },
    {
        path: 'auth',
        loadComponent: () => import('./pages/auth/auth.page').then(m => m.AuthPage)
    },
    {
        path: 'tabs',
        loadComponent: () => import('./pages/tabs/tabs.page').then(m => m.TabsPage),
        canActivate: [AuthGuard],
        children: [
            {
                path: '',
                redirectTo: 'news',
                pathMatch: 'full'
            },
            {
                path: 'news',
                loadComponent: () => import('./pages/news/news.page').then(m => m.NewsPage),
            },
            {
                path: 'search',
                loadComponent: () => import('./pages/search/search.page').then(m => m.SearchPage),
            },
            {
                path: 'bookmarks',
                loadComponent: () => import('./pages/bookmarks/bookmarks.page').then(m => m.BookmarksPage),
            },
            {
                path: 'profile',
                loadComponent: () => import('./pages/profile/profile.page').then(m => m.ProfilePage),
            },
        ]
    },
    {
        path: 'news',
        redirectTo: 'tabs/news',
        pathMatch: 'full'
    },
    {
        path: 'news-detail',
        loadComponent: () => import('./pages/news-detail/news-detail.page').then(m => m.NewsDetailPage),
        canActivate: [AuthGuard]
    },
    {
        path: 'profile',
        redirectTo: 'tabs/profile',
        pathMatch: 'full'
    },
    {
        path: 'privacy-policy',
        loadComponent: () => import('./pages/privacy-policy/privacy-policy.page').then(m => m.PrivacyPolicyPage),
        canActivate: [AuthGuard]
    },
    {
        path: 'licenses',
        loadComponent: () => import('./pages/licenses/licenses.page').then(m => m.LicensesPage),
        canActivate: [AuthGuard]
    },
    {
        path: 'settings',
        loadComponent: () => import('./pages/settings/settings.page').then(m => m.SettingsPage),
        canActivate: [AuthGuard]
    },
];
