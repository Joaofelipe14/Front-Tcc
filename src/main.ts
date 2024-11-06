import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));

  if ('serviceWorker' in navigator && environment.production) {
    navigator.serviceWorker.ready.then((registration) => {
      registration.update();
    });
  }
  