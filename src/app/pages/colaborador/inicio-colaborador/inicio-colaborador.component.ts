import { Component, OnInit } from '@angular/core';
import { CadastroPescaService } from 'src/app/services/cadastro-pesca.service';
import { CadastroVendaService } from 'src/app/services/cadastro-venda.service';
import { DetailModalComponent } from '../../../shared/detail-modal/detail-modal.component';
import { LoadingController, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-inicio-colaborador',
  templateUrl: './inicio-colaborador.component.html',
  styleUrls: ['./inicio-colaborador.component.scss'],
})
export class InicioColaboradorComponent implements OnInit {
  registros: any[] = [];
  segment: string = 'pesca';
  currentPagePesca: number = 1;
  currentPageVenda: number = 1;
  itemsPerPage: number = 5;
  totalPagesPesca: number = 1;
  totalPagesVenda: number = 1;
  loading: any = ''

  constructor(
    private cadastroPescaService: CadastroPescaService,
    private cadastroVendaService: CadastroVendaService,
    private modalController: ModalController,
    private loadingController: LoadingController
  ) { }

  async ngOnInit() {
    this.cadastroPescaService.pescas$.subscribe(newPescas => {
      if (newPescas.length) {
        this.updateRegistros(newPescas[0], 'pesca');
      }
    });

    this.cadastroVendaService.vendas$.subscribe(newVendas => {
      if (newVendas.length) {
        this.updateRegistros(newVendas[0], 'venda');
      }
    });

    this.loading = await this.loadingController.create({
      message: 'Carregando...',
    });
    await this.loading.present();
    this.loadPesca();
    this.loadVendas();
  }

  loadPesca(): void {
    this.cadastroPescaService.getRegistrosByUserId().subscribe(
      response => {
        if (response.status) {
          this.updateRegistros(response.dados.registros, 'pesca');
        }
      },
      error => {

        console.error('Erro ao carregar registros de pesca', error);
      }
    );
  }

  loadVendas(): void {
    this.cadastroVendaService.getRegistrosByUserId().subscribe(
      response => {
        if (response.status) {
          this.loading.dismiss()

          this.updateRegistros(response.dados.registros, 'venda');
        }
      },
      error => {
        this.loading.dismiss()

        console.error('Erro ao carregar registros de vendas', error);
      }
    );
  }

  updateRegistros(newRecords: any[], type: string): void {
    const updatedRecords = newRecords.map(record => ({
      ...record,
      type: type,
      dateTime: type === 'pesca' ? record.data_com_hora : record.created_at
    }));

    this.registros = [...this.registros, ...updatedRecords];
    this.sortRegistros();
    this.calculateTotalPages();
  }

  sortRegistros(): void {
    this.registros.sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime());
  }

  calculateTotalPages(): void {
    this.totalPagesPesca = Math.ceil(this.pescas.length / this.itemsPerPage);
    this.totalPagesVenda = Math.ceil(this.vendas.length / this.itemsPerPage);
  }

  get paginatedPescas() {
    return this.pescas.slice((this.currentPagePesca - 1) * this.itemsPerPage, this.currentPagePesca * this.itemsPerPage);
  }

  get paginatedVendas() {
    return this.vendas.slice((this.currentPageVenda - 1) * this.itemsPerPage, this.currentPageVenda * this.itemsPerPage);
  }

  get pescas() {
    return this.registros.filter(registro => registro.type === 'pesca');
  }

  get vendas() {
    return this.registros.filter(registro => registro.type === 'venda');
  }

  previousPagePesca() {
    if (this.currentPagePesca > 1) {
      this.currentPagePesca--;
    }
  }

  nextPagePesca() {
    if (this.currentPagePesca < this.totalPagesPesca) {
      this.currentPagePesca++;
    }
  }

  previousPageVenda() {
    if (this.currentPageVenda > 1) {
      this.currentPageVenda--;
    }
  }

  nextPageVenda() {
    if (this.currentPageVenda < this.totalPagesVenda) {
      this.currentPageVenda++;
    }
  }

  async openDetailModal(registro: any) {
    const modal = await this.modalController.create({
      component: DetailModalComponent,
      componentProps: { registro: registro },
    });
    return await modal.present();
  }

  formatDateTime(dateTime: string): string {
    const date = new Date(dateTime);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  }
}
