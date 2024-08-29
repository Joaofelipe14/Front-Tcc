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
import { InicioColaboradorComponent } from './pages/colaborador/inicio-colaborador/inicio-colaborador.component';
import { CadastrarPescaComponent } from './pages/colaborador/cadastrar-pesca/cadastrar-pesca.component';
import { HeaderComponent } from './shared/header/header.component';
import { FinanceiroComponent } from './pages/admin/financeiro/financeiro.component';
import { MeuPerfilComponent } from './shared/meu-perfil/meu-perfil.component';
import { HttpClientModule } from '@angular/common/http';
import { NovaSenhaComponent } from './pages/nova-senha/nova-senha.component';


@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    InicioAdminComponent,
    LoginComponent,
    HeaderComponent,
    RegistrarComponent,
    InicioColaboradorComponent,
    CadastrarPescaComponent,
    FinanceiroComponent,
    MeuPerfilComponent,
    NovaSenhaComponent
    
   ],
  imports: [BrowserModule, ReactiveFormsModule, IonicModule.forRoot(), NgxMaskDirective,HttpClientModule,
    AppRoutingModule, ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    })],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule { }
