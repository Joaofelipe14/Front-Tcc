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

  tabelas: string[] = []; 

  isDateFilterOpen: boolean = false;

  constructor(private auditoriaService: AuditoriaService) { }

  ngOnInit() {
    this.loadTabelas();
    this.loadAuditoria();
  }

  loadTabelas() {
    this.auditoriaService.getTabelas().subscribe((data: any) => {
      this.tabelas = data.dados;
    }, error => {
      console.error(error);
    });
  }

  loadAuditoria() {
    this.auditoriaService.getAuditoria(this.filter).subscribe((data: any) => {
      this.auditoriaData = data.dados.data; 
      this.totalPages = data.dados.total; 
      this.last_page = data.dados.last_page;
      this.currentPage = data.dados.current_page
    }, error => {
      console.error(error);
    });
  }

  applyFilters() {
    this.filter.page = 1; 
    this.loadAuditoria();
  }

  nextPage() {
    if (this.currentPage < this.last_page) {
      this.filter.page++;
      this.loadAuditoria();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.filter.page--;
      this.loadAuditoria();
    }
  }

  selectedItem: any;
  showModal = false;
  openModal(item: any) {
    this.selectedItem = item;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.selectedItem = null;

  }
}
