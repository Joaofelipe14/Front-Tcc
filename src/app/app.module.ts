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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RegistrarComponent } from './pages/registrar/registrar.component';
import { NgxMaskDirective } from 'ngx-mask';
import { InicioColaboradorComponent } from './pages/colaborador/inicio-colaborador/inicio-colaborador.component';
import { CadastrarPescaComponent } from './pages/colaborador/cadastrar-pesca/cadastrar-pesca.component';
import { HeaderComponent } from './shared/header/header.component';
import { FinanceiroComponent } from './pages/admin/financeiro/financeiro.component';
import { MeuPerfilComponent } from './shared/meu-perfil/meu-perfil.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NovaSenhaComponent } from './pages/nova-senha/nova-senha.component';
import { CadastrarVendaComponent } from './pages/colaborador/cadastrar-venda/cadastrar-venda.component';
import { AuthInterceptor } from './services/interceptor.service';
import { ConfiguracoesComponent } from './pages/admin/configuracoes/configuracoes.component';
import { GoogleMapsComponent } from './shared/google-map/google-map-autocomplete.component';
import { DetailModalComponent } from './shared/detail-modal/detail-modal.component';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { ModalCadastrarPescaComponent } from './pages/colaborador/cadastrar-pesca/modal-cadastrar-pesca/modal-cadastrar-pesca.component';
import { ModalCadastrarVendaComponent } from './pages/colaborador/cadastrar-venda/modal-cadastrar-venda/modal-cadastrar-venda.component';
import { CadastrarFinanceiroComponent } from './pages/admin/financeiro/cadastrar-financeiro/cadastrar-financeiro.component';
import { AuditoriaComponent } from './pages/admin/configuracoes/auditoria/auditoria.component';
import { LocalizacaoComponent } from './pages/admin/configuracoes/localizacao/localizacao.component';
import { RelatorioFiltroComponent } from './pages/admin/inicio-admin/relatorio-filtro/relatorio-filtro.component';
import { ResultadosmapComponent } from './resultados-map/resultadosmap.component';


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
    NovaSenhaComponent,
    CadastrarVendaComponent,
    ConfiguracoesComponent,
    GoogleMapsComponent,
    DetailModalComponent,
    ModalCadastrarPescaComponent,
    ModalCadastrarVendaComponent,
    CadastrarFinanceiroComponent,
    AuditoriaComponent,
    LocalizacaoComponent,
    RelatorioFiltroComponent,
    ResultadosmapComponent

  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    IonicModule.forRoot({
      scrollAssist: true,
    }),
    NgxMaskDirective,
    HttpClientModule,
    FormsModule,
    CommonModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      positionClass: 'toast-top-right',
      closeButton: true,
      progressBar: true,
      timeOut: 3000,
      preventDuplicates: true,
      tapToDismiss: true,
      progressAnimation: 'increasing'
    }),
    AppRoutingModule, ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    })],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true,
  },
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
