import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { IonContent, LoadingController } from '@ionic/angular';
import { ToastrService } from 'ngx-toastr';
import { LocalizacaoService } from 'src/app/services/localizacao.service';

@Component({
  selector: 'app-localizacao',
  templateUrl: './localizacao.component.html',
  styleUrls: ['./localizacao.component.scss'],
})
export class LocalizacaoComponent  implements OnInit {



  @ViewChild('modalContent') modalContent!: IonContent;
  isAtTop: boolean = true;
  isAtBottom: boolean = false;
  localizacoes: any[] = [];
  filteredLocalizacoes: any[] = [];
  isModalOpenLocalizacao: boolean = false;
  editingLocalizacao: any = null;
  isLoadingBtn = false;
  searchTerm: string = '';
  newLocalizacao: any = {
    descricao: '',
    descricao_amigavel: '',
    latitude: null,
    longitude: null,
  };

 
  scrollToTop() {
    this.isAtBottom = false
    this.isAtTop = true;
    this.modalContent.scrollToTop(300).then(() => {
    });
  }

  scrollToBottom() {
    this.isAtBottom = true
    this.isAtTop = false;
    this.modalContent.scrollToBottom(300).then(() => {
    });
  }

  constructor(
    private loadingController: LoadingController,
    private localizacaoService: LocalizacaoService,
    private cdr: ChangeDetectorRef,
    private toast: ToastrService,

  ) { }

  ngOnInit() {

    this.loadLocalizacoes();

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
          this.toast.success('Localização atualizada.', 'Sucesso');

          this.loadLocalizacoes();
          this.closeModalLocalizacao();
          loading.dismiss();
          this.editingLocalizacao = false;

        },
        error => {
          alert('Erro ao atualizar localização');
          console.error(error);
          this.toast.error('Erro ao atualizar localização', 'Error');

          loading.dismiss();
        }
      );
    } else {

      this.localizacaoService.createLocalizacao(this.newLocalizacao).subscribe(
        async response => {
          this.toast.success('Nova localização cadastrada.', 'Sucesso');

          this.loadLocalizacoes();
          this.closeModalLocalizacao();
          loading.dismiss();
        },
        error => {
          this.toast.error('Erro ao cadastrar localização.', 'Sucesso');
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
    this.newLocalizacao.descricao = coordinates.address;
    this.newLocalizacao.latitude = coordinates.lat;
    this.newLocalizacao.longitude = coordinates.lng;
    this.cdr.detectChanges();
  }

}
