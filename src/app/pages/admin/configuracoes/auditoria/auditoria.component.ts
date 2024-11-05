import { Component, OnInit } from '@angular/core';
import { AuditoriaService } from 'src/app/services/auditoria.service';

@Component({
  selector: 'app-auditoria',
  templateUrl: './auditoria.component.html',
  styleUrls: ['./auditoria.component.scss'],
})
export class AuditoriaComponent implements OnInit {
  auditoriaData: any[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 0;
  last_page:number=0
  filter = {
    tabela: '',
    dataInicial: null,
    dataFinal: null,
    per_page: this.itemsPerPage,
    page: this.currentPage
  };

  tabelas: string[] = []; // Para armazenar as tabelas distintas

  isDateFilterOpen: boolean = false;

  constructor(private auditoriaService: AuditoriaService) { }

  ngOnInit() {
    this.loadTabelas();
    this.loadAuditoria();
  }

  // Método para carregar as tabelas distintas
  loadTabelas() {
    this.auditoriaService.getTabelas().subscribe((data: any) => {
      this.tabelas = data.dados;
    }, error => {
      console.error(error);
    });
  }

  // Método para carregar as auditorias com base nos filtros
  loadAuditoria() {
    this.auditoriaService.getAuditoria(this.filter).subscribe((data: any) => {
      this.auditoriaData = data.dados.data; 
      this.totalPages = data.dados.total; 
      this.last_page = data.dados.last_page;
      this.currentPage = data.dados.current_page
      // console.log(this.currentPage, this.totalPages)
    }, error => {
      console.error(error);
    });
  }

  // Método para aplicar filtros
  applyFilters() {
    this.filter.page = 1; // Resetar para a primeira página
    this.loadAuditoria();
  }

  // Método para ir para a próxima página
  nextPage() {
    console.log(this.currentPage)
    console.log(this.last_page)
    if (this.currentPage < this.last_page) {
      this.filter.page++;
      this.loadAuditoria();
    }
  }

  // Método para ir para a página anterior
  prevPage() {
    console.log(this.currentPage)
    console.log(this.last_page)
    if (this.currentPage > 1) {
      this.filter.page--;
      this.loadAuditoria();
    }
  }

  selectedItem: any;
  showModal = false;
  // Abrir Modal (caso queira exibir mais detalhes)
  openModal(item: any) {
    this.selectedItem = item;
    this.showModal = true;
    console.log('close')
  }

  closeModal() {
    this.showModal = false;
    this.selectedItem = null;

  }
}
