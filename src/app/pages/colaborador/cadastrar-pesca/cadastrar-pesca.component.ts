import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { CadastroPescaService } from 'src/app/services/cadastro-pesca.service';
import { ModalCadastrarPescaComponent } from '../modal-cadastrar-pesca/modal-cadastrar-pesca.component';
import { DetailModalComponent } from 'src/app/shared/detail-modal/detail-modal.component';

@Component({
  selector: 'app-cadastrar-pesca',
  templateUrl: './cadastrar-pesca.component.html',
  styleUrls: ['./cadastrar-pesca.component.scss'],
})
export class CadastrarPescaComponent implements OnInit {

  localizacoes: any;
  isLoading = false;
  isModalOpen = false;
  currentPagePesca: number = 1;
  itemsPerPage: number = 5;
  totalPagesPesca: number = 1;
  loading: any = ''
  registros: any[] = [];

  constructor(
    private cadastroPescaService: CadastroPescaService,
    private modalController: ModalController,
    private loadingController: LoadingController
  ) { }

  async ngOnInit() {
    this.cadastroPescaService.pescas$.subscribe(newPescas => {
      if (newPescas.length) {
        this.updateRegistros(newPescas[0], 'pesca');
      }
    });

    this.loading = await this.loadingController.create({
      message: 'Carregando...',
    });
    await this.loading.present();
    this.loadPesca()
  }

  get paginatedPescas() {
    return this.pescas.slice((this.currentPagePesca - 1) * this.itemsPerPage, this.currentPagePesca * this.itemsPerPage);
  }

  get pescas() {
    return this.registros.filter(registro => registro.type === 'pesca');
  }

  async openModal() {
    const modal = await this.modalController.create({
      component: ModalCadastrarPescaComponent,
    });
    return await modal.present();
  }

  loadPesca(): void {
    this.cadastroPescaService.getRegistrosByUserId().subscribe(
      response => {
        if (response.status) {
          this.updateRegistros(response.dados.registros, 'pesca');
        }
        this.loading.dismiss()
      },
      error => {
        console.error('Erro ao carregar registros de pesca', error);
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
    this.totalPagesPesca = Math.ceil(this.pescas.length / this.itemsPerPage);
  }

  nextPagePesca() {
    if (this.currentPagePesca < this.totalPagesPesca) {
      this.currentPagePesca++;
    }
  }

  previousPagePesca() {
    if (this.currentPagePesca > 1) {
      this.currentPagePesca--;
    }
  }

  async openDetailModal(registro: any) {
    const modal = await this.modalController.create({
      component: DetailModalComponent,
      componentProps: { registro: registro },
    });
    return await modal.present();
  }


}
