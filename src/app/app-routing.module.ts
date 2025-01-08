import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegistrarComponent } from './pages/registrar/registrar.component';
import { InicioAdminComponent } from './pages/admin/inicio-admin/inicio-admin.component';
import { InicioColaboradorComponent } from './pages/colaborador/inicio-colaborador/inicio-colaborador.component';
import { CadastrarPescaComponent } from './pages/colaborador/cadastrar-pesca/cadastrar-pesca.component';
import { FinanceiroComponent } from './pages/admin/financeiro/financeiro.component';
import { MeuPerfilComponent } from './shared/meu-perfil/meu-perfil.component';
import { NovaSenhaComponent } from './pages/nova-senha/nova-senha.component';
import { CadastrarVendaComponent } from './pages/colaborador/cadastrar-venda/cadastrar-venda.component';
import { ConfiguracoesComponent } from './pages/admin/configuracoes/configuracoes.component';
import { ResultadosmapComponent } from './pages/admin/inicio-admin/resultados-map/resultadosmap.component';

const routes: Routes = [

  {
    path: '',
    component: LoginComponent
  },

  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'registrar',
    component: RegistrarComponent
  },
  {
    path: 'nova-senha',
    component: NovaSenhaComponent
  },
  {
    path: ':tipoUsuario/meu-perfil',
    component: MeuPerfilComponent
  },
  /*   Rotas para o admin */

  {
    path: 'admin/inicio',
    component: InicioAdminComponent
  },
  {
    path: 'admin/financeiro',
    component: FinanceiroComponent
  },
  {
    path: 'admin/configuracoes',
    component: ConfiguracoesComponent
  },
  /* rotas para o colaborador */
  {
    path: 'colaborador/inicio',
    component: InicioColaboradorComponent
  },
  {
    path: 'colaborador/cadastrar-pesca',
    component: CadastrarPescaComponent
  },
  {
    path: 'colaborador/cadastrar-venda',
    component: CadastrarVendaComponent
  },
  {
    path: 'teste',
    component: ResultadosmapComponent
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
