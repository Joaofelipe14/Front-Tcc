import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { AlertController, IonContent, LoadingController, ScrollDetail } from '@ionic/angular';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { LocalizacaoService } from 'src/app/services/localizacao.service';
import { Utils } from 'src/app/utils/utils';

@Component({
  selector: 'app-configuracoes',
  templateUrl: './configuracoes.component.html',
  styleUrls: ['./configuracoes.component.scss'],
})
export class ConfiguracoesComponent implements OnInit {
  usuarios: any[] = [];
  filteredUsuarios: any[] = [];
  searchName: string = '';
  isModalOpen: boolean = false;
  selectedUsuario: any;
  selectedTipoUsuario: string = '';
  selectedSegment: string = 'usuarios';
  Utils = Utils
  isLoadingBtn = false;


  constructor(
    private authService: AuthService,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private cdr: ChangeDetectorRef,
    private toast: ToastrService,
  ) { }

  ngOnInit() {
    this.loadUsuarios();

    window.history.pushState({ modal: true }, '')
    window.addEventListener('popstate', this.handleBack.bind(this))
  }

  handleBack() {
    // this.dismissModal()
    this.closeModal()
  }

  ngOnDestroy() {
    window.addEventListener('popstate', this.handleBack.bind(this))
  }
  
  async loadUsuarios() {
    const loading = await this.loadingController.create({
      message: 'Carregando usuários...',
    });
    await loading.present();

    this.authService.getUsuarios().subscribe((data: any) => {
      this.usuarios = data.dados;
      this.filteredUsuarios = this.usuarios;
      loading.dismiss();
      this.updatePagination()
    }, error => {
      loading.dismiss();
    });
  }

  totalPagesUsers: number = 1;
  itemsPerPage: number = 15;
  totalPagesUser: number = 0;
  paginatedUsuarios: any[] = [];

  filterUsuarios() {
    this.filteredUsuarios = this.usuarios.filter(usuario =>
      usuario.name.toLowerCase().includes(this.searchName.toLowerCase())
    );
    this.updatePagination();
  }

  updatePagination() {
    this.totalPagesUser = Math.ceil(this.filteredUsuarios.length / this.itemsPerPage);
    this.paginatedUsuarios = this.filteredUsuarios.slice((this.totalPagesUsers - 1) * this.itemsPerPage, this.totalPagesUsers * this.itemsPerPage);
  }

  prevPage() {
    if (this.totalPagesUsers > 1) {
      this.totalPagesUsers--;
      this.updatePagination();
    }
  }

  nextPage() {
    if (this.totalPagesUsers < this.totalPagesUser) {
      this.totalPagesUsers++;
      this.updatePagination();
    }
  }
  openUsuarioDetails(usuario: any) {
    this.selectedUsuario = usuario;
    this.selectedTipoUsuario = usuario.tipo_usuario
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedUsuario = null;
  }

  segmentChanged(event: any) {
    this.selectedSegment = event.detail.value;
  }

  async updateTipoUsuario(selectedTipoUsuario: string) {
    const payload = {
      tipo_usuario: selectedTipoUsuario,
    };


    try {
      const response = await this.authService.atualizar(payload, this.selectedUsuario.id).toPromise();
      if (response.sucesso) {
        this.toast.success('Grupo do usuario atualizado.', 'Sucesso');

        this.closeModal();
        this.loadUsuarios();

      } else {
        this.toast.error('Erro ao atualizar grupo de usuario.', 'Erro');

      }
    } catch (error) {
      this.toast.error('Erro ao atualizar grupo de usuario.', 'Erro');

      console.error('Erro ao atualizar tipo de usuário:', error);
    }
  }


  async confirmUpdateGrupoUser(selectedTipoUsuario: string) {
    const alert = await this.alertController.create({
      header: 'Confirmar',
      message: 'Tem certeza que deseja alterar o grupo tipo desse usuarios??',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Confirmar',
          handler: () => {
            this.updateTipoUsuario(selectedTipoUsuario);
          }
        }
      ]
    });

    await alert.present();
  }

  async confirmResetPassword() {
    const alert = await this.alertController.create({
      header: 'Confirmar',
      message: 'Tem certeza que deseja resetar a senha?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Confirmar',
          handler: () => {
            this.resetPassword();
          }
        }
      ]
    });

    await alert.present();
  }

  async resetPassword() {
    const payload = {
      primeiro_acesso: 'S'
    };

    try {
      this.isLoadingBtn = true;
      const response = await this.authService.atualizar(payload, this.selectedUsuario.id).toPromise();
      // Lidar com a resposta do servidor
      if (response.sucesso) {
        this.isLoadingBtn = false
        this.toast.success('Senha resetada para o CPF.', 'Sucesso');
        this.closeModal();
        this.loadUsuarios();

      } else {
        this.isLoadingBtn = false
        this.toast.error('Erro ao resetar senha de usuario.', 'Erro');

      }
    } catch (error) {
      this.isLoadingBtn = false
      console.error('Erro ao resetar a senha:', error);
      this.toast.error('Erro ao resetar a senha.', 'Erro');

    }
  }



}
