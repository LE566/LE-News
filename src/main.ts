import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { provideHttpClient } from '@angular/common/http';
import { addIcons } from 'ionicons';
import {
  newspaper, newspaperOutline, personOutline, mailOutline, lockClosedOutline,
  logInOutline, personAddOutline, fingerPrintOutline, personCircleOutline,
  chevronDownCircleOutline, shareOutline, arrowForwardOutline, logOutOutline,
  camera, notificationsOutline, shieldCheckmarkOutline, chevronForwardOutline,
  codeSlashOutline, closeOutline, createOutline, bookmarkOutline, bookmark,
  timeOutline, calendarOutline, searchOutline, settingsOutline, moonOutline,
  textOutline, globeOutline, refreshOutline, imageOutline, trashOutline,
  informationCircleOutline, heartOutline, serverOutline, colorPaletteOutline,
  checkmarkCircleOutline
} from 'ionicons/icons';

import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';

// Register all icons used in the app
addIcons({
  newspaper,
  'newspaper-outline': newspaperOutline,
  'person-outline': personOutline,
  'mail-outline': mailOutline,
  'lock-closed-outline': lockClosedOutline,
  'log-in-outline': logInOutline,
  'person-add-outline': personAddOutline,
  'finger-print-outline': fingerPrintOutline,
  'person-circle-outline': personCircleOutline,
  'chevron-down-circle-outline': chevronDownCircleOutline,
  'share-outline': shareOutline,
  'arrow-forward-outline': arrowForwardOutline,
  'log-out-outline': logOutOutline,
  camera,
  'notifications-outline': notificationsOutline,
  'shield-checkmark-outline': shieldCheckmarkOutline,
  'chevron-forward-outline': chevronForwardOutline,
  'code-slash-outline': codeSlashOutline,
  'close-outline': closeOutline,
  'create-outline': createOutline,
  'bookmark-outline': bookmarkOutline,
  bookmark,
  'time-outline': timeOutline,
  'calendar-outline': calendarOutline,
  'search-outline': searchOutline,
  'settings-outline': settingsOutline,
  'moon-outline': moonOutline,
  'text-outline': textOutline,
  'globe-outline': globeOutline,
  'refresh-outline': refreshOutline,
  'image-outline': imageOutline,
  'trash-outline': trashOutline,
  'information-circle-outline': informationCircleOutline,
  'heart-outline': heartOutline,
  'server-outline': serverOutline,
  'color-palette-outline': colorPaletteOutline,
  'checkmark-circle-outline': checkmarkCircleOutline,
});

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideHttpClient(),
  ],
});
