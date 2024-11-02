import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CadastroPescaService } from 'src/app/services/cadastro-pesca.service';
import { CadastroVendaService } from 'src/app/services/cadastro-venda.service';
import { DetailModalComponent } from 'src/app/shared/detail-modal/detail-modal.component';
import { LocalizacaoService } from 'src/app/services/localizacao.service'; 

@Component({
  selector: 'app-inicio-admin',
  templateUrl: './inicio-admin.component.html',
  styleUrls: ['./inicio-admin.component.scss'],
})
export class InicioAdminComponent implements OnInit {
  segment: string = 'pesca';
  registrosPesca: any[] = [];
  registrosVenda: any[] = [];
  searchTerm: string = ''; 
  selectedLocalizacao: string = ''; 
  localizacoes: any[] = []; 
  
  // Registros filtrados
  filteredPesca: any[] = [];
  filteredVenda: any[] = [];

  // Paginação
  currentPagePesca: number = 1;
  currentPageVenda: number = 1;
  itemsPerPage: number = 5;
  totalPagesPesca: number = 0;
  totalPagesVenda: number = 0;

  constructor(
    private cadastroPescaService: CadastroPescaService,
    private cadastroVendaService: CadastroVendaService,
    private modalController: ModalController,
    private localizacaoService: LocalizacaoService 
  ) {}

  ngOnInit() {
    this.loadPescaAll();
    this.loadVendasAll();
    this.loadLocalizacoes(); 
  }

  loadPescaAll(): void {
    this.cadastroPescaService.getRegistrosAll().subscribe(
      (response) => {
        if (response.status) {
          this.registrosPesca = response.dados.registros.map((registro: any) => ({
            ...registro,
            type: 'pesca'
          }));
          this.filteredPesca = this.registrosPesca;
          this.totalPagesPesca = Math.ceil(this.filteredPesca.length / this.itemsPerPage);
        }
      },
      (error) => {
        console.error('Erro ao carregar registros de pesca', error);
      }
    );
  }

  loadVendasAll(): void {
    this.cadastroVendaService.getRegistrosAll().subscribe(
      (response) => {
        if (response.status) {
          this.registrosVenda = response.dados.registros.map((registro: any) => ({
            ...registro,
            type: 'venda'
          }));
          this.filteredVenda = this.registrosVenda;
          this.totalPagesVenda = Math.ceil(this.filteredVenda.length / this.itemsPerPage);
        }
      },
      (error) => {
        console.error('Erro ao carregar registros de vendas', error);
      }
    );
  }

  loadLocalizacoes(): void {
    this.localizacaoService.getLocalizacoes().subscribe(
      (data) => {
        this.localizacoes = data.dados.registros; 
        console.log('Localizações carregadas:', this.localizacoes);
      },
      (error) => {
        console.error('Erro ao carregar localizações', error);
      }
    );
  }

  segmentChanged(event: any): void {
    this.segment = event.detail.value;
  }

  filterRecords() {
    if (this.segment === 'pesca') {
      this.filteredPesca = this.registrosPesca.filter(registro =>
        registro.user.name.toLowerCase().includes(this.searchTerm.toLowerCase()) &&
        (this.selectedLocalizacao ? registro.local === this.selectedLocalizacao : true) 
      );
      this.currentPagePesca = 1;
      this.totalPagesPesca = Math.ceil(this.filteredPesca.length / this.itemsPerPage);
    } else {
      this.filteredVenda = this.registrosVenda.filter(registro =>
        registro.user.name.toLowerCase().includes(this.searchTerm.toLowerCase()) &&
        (this.selectedLocalizacao ? registro.ponto_venda === this.selectedLocalizacao : true) 
      );
      this.currentPageVenda = 1;
      this.totalPagesVenda = Math.ceil(this.filteredVenda.length / this.itemsPerPage);
    }
  }

  get paginatedPesca() {
    const start = (this.currentPagePesca - 1) * this.itemsPerPage;
    return this.filteredPesca.slice(start, start + this.itemsPerPage);
  }

  get paginatedVenda() {
    const start = (this.currentPageVenda - 1) * this.itemsPerPage;
    return this.filteredVenda.slice(start, start + this.itemsPerPage);
  }

  previousPagePesca(): void {
    if (this.currentPagePesca > 1) {
      this.currentPagePesca--;
    }
  }

  nextPagePesca(): void {
    if (this.currentPagePesca < this.totalPagesPesca) {
      this.currentPagePesca++;
    }
  }

  previousPageVenda(): void {
    if (this.currentPageVenda > 1) {
      this.currentPageVenda--;
    }
  }

  nextPageVenda(): void {
    if (this.currentPageVenda < this.totalPagesVenda) {
      this.currentPageVenda++;
    }
  }

  async openModal(registro: any) {
    console.log(registro);
    const modal = await this.modalController.create({
      component: DetailModalComponent,
      componentProps: { registro }
    });
    return await modal.present();
  }

  formatDateTime(dateTime: string): string {
    const date = new Date(dateTime);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  }
}
