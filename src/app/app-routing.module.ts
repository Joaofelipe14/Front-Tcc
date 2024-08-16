import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegistrarComponent } from './pages/registrar/registrar.component';
import { InicioAdminComponent } from './pages/admin/inicio-admin/inicio-admin.component';
import { InicioColaboradorComponent } from './pages/colaborador/inicio-colaborador/inicio-colaborador.component';
import { MeuPerfilColaboradorComponent } from './pages/colaborador/meu-perfil-colaborador/meu-perfil-colaborador.component';
import { CadastrarPescaComponent } from './pages/colaborador/cadastrar-pesca/cadastrar-pesca.component';

const routes: Routes = [

  { 
    path: '', 
    component: LoginComponent
   },

  { 
    path: 'login', 
    component: LoginComponent
   },
  { path: 'registrar',
     component: RegistrarComponent 
  },
  {
    path:'admin/inicio',
    component: InicioAdminComponent
  },
  {
    path:'colaborador/inicio',
    component: InicioColaboradorComponent
  },
  {
    path:'colaborador/meu-perfil',
    component: MeuPerfilColaboradorComponent
  },
  {
    path:'colaborador/cadastrar-pesca',
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
