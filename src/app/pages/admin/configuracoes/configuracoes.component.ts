import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { AlertController, IonContent, LoadingController, ScrollDetail } from '@ionic/angular';
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
  editingLocalizacao: any = null;



  @ViewChild('modalContent') modalContent!: IonContent; 
  isAtTop: boolean = true; 
  isAtBottom: boolean = false;  

  onScroll(event: any) {
    console.log(event)
    const scrollTop = event.detail.scrollTop;
    const scrollHeight = event.detail.scrollHeight;
    const offsetHeight = event.detail.offsetHeight;

    this.isAtTop = scrollTop === 0;

    // Verifica se o conteúdo está no fundo
    this.isAtBottom = scrollTop + offsetHeight >= scrollHeight;

    console.log(this.isAtBottom)
  }

  handleScrollStart() {
    console.log('scroll start');
  }

  handleScroll(ev: CustomEvent<ScrollDetail>) {
    console.log('scroll', JSON.stringify(ev.detail));
  }

  handleScrollEnd() {
    console.log('scroll end');
  }
  scrollToTop() {
    this.isAtBottom=false
    this.isAtTop= true;
    this.modalContent.scrollToTop(300).then(() => {
    });
  }

  // Scroll para o fundo
  scrollToBottom() {
    this.isAtBottom=true
    this.isAtTop= false;
    this.modalContent.scrollToBottom(300).then(() => {
    });
  }
  constructor(private authService: AuthService,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private localizacaoService: LocalizacaoService,
    private cdr: ChangeDetectorRef,

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

  async updateTipoUsuario(selectedTipoUsuario: string) {
    const payload = {
      tipo_usuario: selectedTipoUsuario,
    };


    try {
      const response = await this.authService.atualizar(payload, this.selectedUsuario.id).toPromise();
      // Lidar com a resposta do servidor
      console.log('Tipo de usuário atualizado com sucesso:', response);
    } catch (error) {
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

  openEditModal(localizacao: any) {

    this.newLocalizacao = {
      descricao: localizacao.descricao,
      descricao_amigavel: localizacao.descricao_amigavel,
      latitude: localizacao.latitude,
      longitude: localizacao.longitude
    };

    // Abrir o modal
    this.isModalOpenLocalizacao = true;
    this.editingLocalizacao = true;
  }


  closeModalLocalizacao() {
    this.isModalOpenLocalizacao = false;
    this.editingLocalizacao = false;
    this.resetNewLocalizacao();
  }

  async cadastrarLocalizacao() {
    const loading = await this.loadingController.create({
      message: this.editingLocalizacao ? 'Atualizando localização...' : 'Salvando localização...',
    });
    await loading.present();

    if (this.editingLocalizacao) {

      this.localizacaoService.updateLocalizacao(this.newLocalizacao, this.editingLocalizacao.id).subscribe(
        async response => {
          console.log('Localização atualizada:', response);
          this.loadLocalizacoes();
          this.closeModalLocalizacao();
          loading.dismiss();
          this.editingLocalizacao = false;

        },
        error => {
          alert('Erro ao atualizar localização');
          console.error('Erro ao atualizar localização:', error);
          loading.dismiss();
        }
      );
    } else {

      this.localizacaoService.createLocalizacao(this.newLocalizacao).subscribe(
        async response => {
          console.log('Localização cadastrada:', response);
          this.loadLocalizacoes();
          this.closeModalLocalizacao();
          loading.dismiss();
        },
        error => {
          alert('Erro ao cadastrar nova localização');
          console.error('Erro ao cadastrar localização:', error);
          loading.dismiss();
        }
      );
    }
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
  handlePlaceSelected(coordinates: { lat: number, lng: number, name: string, address: string }) {
    console.log('Local Selecionado:', coordinates.name);
    console.log('Endereço:', coordinates.address);
    console.log('Latitude:', coordinates.lat);
    console.log('Longitude:', coordinates.lng);

    this.newLocalizacao.descricao = coordinates.address;
    this.newLocalizacao.latitude = coordinates.lat;
    this.newLocalizacao.longitude = coordinates.lng;
    this.cdr.detectChanges();

  }



}
