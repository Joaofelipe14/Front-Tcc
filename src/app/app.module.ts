import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ServiceWorkerModule } from '@angular/service-worker';
import { MenuComponent } from './shared/menu/menu.component';
import { InicioAdminComponent } from './pages/admin/inicio-admin/inicio-admin.component';
import { LoginComponent } from './pages/login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RegistrarComponent } from './pages/registrar/registrar.component';
import { NgxMaskDirective } from 'ngx-mask';


@NgModule({
  declarations: [AppComponent, MenuComponent, InicioAdminComponent, LoginComponent,RegistrarComponent],
  imports: [BrowserModule,ReactiveFormsModule,IonicModule.forRoot(),   NgxMaskDirective,
    AppRoutingModule, ServiceWorkerModule.register('ngsw-worker.js', {
  enabled: !isDevMode(),
  // Register the ServiceWorker as soon as the application is stable
  // or after 30 seconds (whichever comes first).
  registrationStrategy: 'registerWhenStable:30000'
})],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
