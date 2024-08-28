import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegistrarComponent } from './pages/registrar/registrar.component';
import { InicioAdminComponent } from './pages/admin/inicio-admin/inicio-admin.component';
import { InicioColaboradorComponent } from './pages/colaborador/inicio-colaborador/inicio-colaborador.component';
import { CadastrarPescaComponent } from './pages/colaborador/cadastrar-pesca/cadastrar-pesca.component';
import { FinanceiroComponent } from './pages/admin/financeiro/financeiro.component';
import { MeuPerfilComponent } from './shared/meu-perfil/meu-perfil.component';

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
  /* rotas para o colaborador */
  {
    path: 'colaborador/inicio',
    component: InicioColaboradorComponent
  },

  {
    path: 'colaborador/cadastrar-pesca',
    component: CadastrarPescaComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
