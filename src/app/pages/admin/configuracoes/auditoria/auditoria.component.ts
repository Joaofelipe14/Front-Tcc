import { Component, OnInit } from '@angular/core';
import { AuditoriaService } from 'src/app/services/auditoria.service';

@Component({
  selector: 'app-auditoria',
  templateUrl: './auditoria.component.html',
  styleUrls: ['./auditoria.component.scss'],
})
export class AuditoriaComponent implements OnInit {
  auditoriaData: any[] = [];
  paginatedData: any[] = [];
  selectedItem: any = null;
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 0;

  filter = {
    tabela: '',
    dataInicial: null,
    dataFinal: null,
  };

  isDateFilterOpen: boolean = false;

  constructor(private auditoriaService: AuditoriaService) {}

  ngOnInit() {
    this.loadAuditoria();
  }

  async loadAuditoria() {
    this.auditoriaService.getAuditoria().subscribe((data: any) => {
      this.auditoriaData = data.dados;
      this.auditoriaData.sort((a, b) => b.id - a.id);
      this.updatePaginatedData();
    }, error => {
      console.error(error);
    });
  }

  applyFilters() {
    this.currentPage = 1;
    this.updatePaginatedData();
  }

  updatePaginatedData() {
    const filteredData = this.auditoriaData.filter(item => {
      const matchesTabela = this.filter.tabela ? item.tabela.includes(this.filter.tabela) : true;
      const matchesDate = this.filter.dataInicial && this.filter.dataFinal 
        ? new Date(item.created_at) >= new Date(this.filter.dataInicial) && new Date(item.created_at) <= new Date(this.filter.dataFinal) 
        : true;
      return matchesTabela && matchesDate;
    });

    this.totalPages = Math.ceil(filteredData.length / this.itemsPerPage);
    this.paginatedData = filteredData.slice((this.currentPage - 1) * this.itemsPerPage, this.currentPage * this.itemsPerPage);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedData();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedData();
    }
  }

  showModal=false

  openModal(item: any) {
    this.selectedItem = item;
    this.showModal = true;
  }

  closeModal() {
    this.selectedItem = null;
    this.showModal = false;

  }
}
