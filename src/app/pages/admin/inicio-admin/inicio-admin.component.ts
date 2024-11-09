import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CadastroPescaService } from 'src/app/services/cadastro-pesca.service';
import { CadastroVendaService } from 'src/app/services/cadastro-venda.service';
import { DetailModalComponent } from 'src/app/shared/detail-modal/detail-modal.component';
import { LocalizacaoService } from 'src/app/services/localizacao.service';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { RelatorioFiltroComponent } from './relatorio-filtro/relatorio-filtro.component';

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
  maxItensPagePesca: number = 0;
  maxItensPageVenda: number = 0;
  itemsPerPageVenda: number = 5;
  totalPagesPesca: number = 0;
  totalPagesVenda: number = 0;

  searchTermChanged: Subject<string> = new Subject();
  isLoading = false;

  constructor(
    private cadastroPescaService: CadastroPescaService,
    private cadastroVendaService: CadastroVendaService,
    private modalController: ModalController,
    private localizacaoService: LocalizacaoService,
  ) { }

  ngOnInit() {
    this.loadPescaAll();
    this.loadVendasAll();
    this.loadLocalizacoes();

    this.searchTermChanged.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe(() => {
      this.filterRecords();
    });
  }

  loadPescaAll(): void {
    const params = {
      page: this.currentPagePesca,
      // limit: this.itemsPerPage,
      searchTerm: this.searchTerm,
      selectedLocalizacao: this.selectedLocalizacao
    };

    this.isLoading = true;

    this.cadastroPescaService.getRegistrosAll(params).subscribe((response) => {
      if (response.status) {

        this.registrosPesca = response.dados.registros.data.map((registro: any) => ({
          ...registro,
          type: 'pesca'
        }));
        this.isLoading = false;
        this.totalPagesPesca = response.dados.registros.last_page
      }
    },
      (error) => {
        this.isLoading = false;

        console.error('Erro ao carregar registros de pesca', error);
      }
    );
  }

  loadVendasAll(): void {
    const params = {
      page: this.currentPageVenda,
      // limit: this.itemsPerPage,
      searchTerm: this.searchTerm,
      selectedLocalizacao: this.selectedLocalizacao
    };

    this.isLoading = true;
    this.cadastroVendaService.getRegistrosAll(params).subscribe(
      (response) => {
        if (response.status) {
          this.registrosVenda = response.dados.registros.data.map((registro: any) => ({
            ...registro,
            type: 'venda'
          }));
          // this.maxItensPageVenda = this.filteredVenda.length;
          this.totalPagesVenda = response.dados.registros.last_page
          this.currentPageVenda = response.dados.registros.current_page
          this.isLoading = false;

        }
      },
      (error) => {
        this.isLoading = false;

        console.error('Erro ao carregar registros de vendas', error);
      }
    );
  }

  onSearchTermChange() {
    this.searchTermChanged.next(this.searchTerm);
  }

  loadLocalizacoes(): void {
    this.localizacaoService.getLocalizacoes().subscribe(
      (data) => {
        this.localizacoes = data.dados.registros;
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

      this.loadPescaAll();
    } else {

      this.loadVendasAll()
    }
  }


  previousPagePesca(): void {
    if (this.currentPagePesca > 1) {
      this.currentPagePesca--;
      this.loadPescaAll();
    }
  }

  nextPagePesca(): void {
    if (this.currentPagePesca < this.totalPagesPesca) {
      this.currentPagePesca++;
      this.loadPescaAll();
    }
  }


  previousPageVenda(): void {
    if (this.currentPageVenda > 1) {
      this.currentPageVenda--;
      this.loadVendasAll()

    }
  }

  nextPageVenda(): void {
    if (this.currentPageVenda < this.totalPagesVenda) {
      this.currentPageVenda++;
      this.loadVendasAll()

    }
  }

  async openModal(registro: any) {
    const modal = await this.modalController.create({
      component: DetailModalComponent,
      componentProps: { registro },
      cssClass: 'custom-modal-class',

    });
    return await modal.present();
  }


  async openFiltroModal() {
    const modal = await this.modalController.create({
      component: RelatorioFiltroComponent
    });

    return await modal.present();
  }
  formatDateTime(dateTime: string): string {
    const date = new Date(dateTime);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  }
}
