import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';
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

  searchTerm: string = '';
  newLocalizacao: any = {
    descricao: '',
    descricao_amigavel: '',
    latitude: null,
    longitude: null,
  };
  localizacoes: any[] = [];
  filteredLocalizacoes: any[] = [];
  isModalOpenLocalizacao: boolean = false;

  constructor(private authService: AuthService,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private localizacaoService: LocalizacaoService
  ) { }

  ngOnInit() {
    this.loadUsuarios();
    this.loadLocalizacoes();

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
    }, error => {
      loading.dismiss();
      // Trate o erro conforme necessário
    });
  }

  filterUsuarios() {
    this.filteredUsuarios = this.usuarios.filter(usuario =>
      usuario.name.toLowerCase().includes(this.searchName.toLowerCase())
    );
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



  async updateTipoUsuario() {
    const payload = {
      tipo_usuario: 'teste',
    };

    try {
      const response = await this.authService.atualizar(payload, this.selectedUsuario.id).toPromise();
      // Lidar com a resposta do servidor
      console.log('Tipo de usuário atualizado com sucesso:', response);
    } catch (error) {
      console.error('Erro ao atualizar tipo de usuário:', error);
    }
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
      const response = await this.authService.atualizar(payload, this.selectedUsuario.id).toPromise();
      // Lidar com a resposta do servidor
      console.log('Senha resetada com sucesso:', response);
    } catch (error) {
      console.error('Erro ao resetar a senha:', error);
    }
  }



  loadLocalizacoes() {
    this.localizacaoService.getLocalizacoes().subscribe(data => {
      this.localizacoes = data.dados.registros; 
      this.filteredLocalizacoes = this.localizacoes; 
    });
  }

  openCadastroModalLocalizacao() {
    this.isModalOpenLocalizacao = true;
  }

  closeModalLocalizacao() {
    this.isModalOpenLocalizacao = false;
    this.resetNewLocalizacao();
  }

  cadastrarLocalizacao() {
    this.localizacaoService.createLocalizacao(this.newLocalizacao).subscribe(response => {
      console.log('Localização cadastrada:', response);
      this.loadLocalizacoes(); 
      this.closeModal(); 
    }, error => {
      console.error('Erro ao cadastrar localização:', error);
    });
  }

  filterLocalizacoes() {
    if (this.searchTerm) {
      this.filteredLocalizacoes = this.localizacoes.filter(localizacao =>
        localizacao.descricao.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else {
      this.filteredLocalizacoes = this.localizacoes; 
    }
  }

  resetNewLocalizacao() {
    this.newLocalizacao = { descricao: '', descricao_amigavel: '', latitude: null, longitude: null };
  }

}
