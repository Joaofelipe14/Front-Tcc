import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { ToastrService } from 'ngx-toastr';
import { CadastroVendaService } from 'src/app/services/cadastro-venda.service';
import { ModalCadastrarVendaComponent } from './modal-cadastrar-venda/modal-cadastrar-venda.component';
import { DetailModalComponent } from 'src/app/shared/detail-modal/detail-modal.component';
@Component({
  selector: 'app-cadastrar-venda',
  templateUrl: './cadastrar-venda.component.html',
  styleUrls: ['./cadastrar-venda.component.scss'],
})
export class CadastrarVendaComponent implements OnInit {

  registros: any[] = [];
  currentPageVenda: number = 1;
  itemsPerPage: number = 5;
  totalPagesVenda: number = 1;
  loading: any = ''

  constructor(
    private cadastroVendaService: CadastroVendaService,
    private modalController: ModalController,
    private loadingController: LoadingController

  ) { }
  async ngOnInit() {
    this.cadastroVendaService.vendas$.subscribe(newVendas => {
      if (newVendas.length) {
        this.updateRegistros(newVendas[0], 'venda');
      }
    });

    this.loading = await this.loadingController.create({
      message: 'Carregando...',
    });
    await this.loading.present();
    this.loadVendas();
  }

  loadVendas(): void {
    this.cadastroVendaService.getRegistrosByUserId().subscribe(
      response => {
        if (response.status) {
          this.updateRegistros(response.dados.registros, 'venda');
          this.loading.dismiss()

        }
      },
      error => {
        console.error('Erro ao carregar registros de vendas', error);
        this.loading.dismiss()

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
    this.totalPagesVenda = Math.ceil(this.vendas.length / this.itemsPerPage);
  }

  get pescas() {
    return this.registros.filter(registro => registro.type === 'pesca');
  }

  get vendas() {
    return this.registros.filter(registro => registro.type === 'venda');
  }

  previousPageVenda() {
    if (this.currentPageVenda > 1) {
      this.currentPageVenda--;
    }
  }

  get paginatedVendas() {
    return this.vendas.slice((this.currentPageVenda - 1) * this.itemsPerPage, this.currentPageVenda * this.itemsPerPage);
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

  async openModal() {
    const modal = await this.modalController.create({
      component: ModalCadastrarVendaComponent,
    });
    return await modal.present();
  }

  formatDateTime(dateTime: string): string {
    const date = new Date(dateTime);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  }

}
