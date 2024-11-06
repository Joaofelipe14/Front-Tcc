import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CadastroPescaService } from 'src/app/services/cadastro-pesca.service';
import { AuthService } from 'src/app/services/auth.service';
import { LocalizacaoService } from 'src/app/services/localizacao.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-relatorio-filtro',
  templateUrl: './relatorio-filtro.component.html',
  styleUrls: ['./relatorio-filtro.component.scss'],
})
export class RelatorioFiltroComponent implements OnInit {
  startDate!: string;
  endDate!: string;
  location: string = 'todos';
  searchTerm: string = '';
  usuarios: any[] = [];
  filteredUsuarios: any[] = [];
  selectedUsers: any[] = [];
  localizacoes: any[] = [];
  currentField: string | null = null;
  isLoading = false


  constructor(
    private modalController: ModalController,
    private cadastroPescaService: CadastroPescaService,
    private authService: AuthService,
    private localizacaoService: LocalizacaoService,
    private toast: ToastrService
  ) { }

  ngOnInit() {
    this.authService.getUsuarios().subscribe((data: any) => {
      this.usuarios = data.dados;
    });

    this.loadLocalizacoes();
  }

  loadLocalizacoes() {
    this.localizacaoService.getLocalizacoes().subscribe(
      (data) => {
        this.localizacoes = data.dados.registros;
      },
      (error) => {
        console.error('Erro ao carregar localizações', error);
      }
    );
  }

  filterUsers() {
    if (this.searchTerm.trim() === '') {
      this.filteredUsuarios = this.usuarios;
    } else {
      this.filteredUsuarios = this.usuarios.filter(usuario =>
        usuario.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }

  selectUser(usuario: any) {
    if (!this.selectedUsers.includes(usuario)) {
      this.selectedUsers.push(usuario);
    }
    this.searchTerm = '';
    this.filteredUsuarios = [];
  }

  removeUser(usuario: any) {
    this.selectedUsers = this.selectedUsers.filter(u => u.id !== usuario.id);
  }

  close() {
    this.modalController.dismiss();
  }

  applyFilters() {

    const filters = {
      startDate: this.startDate,
      endDate: this.endDate,
      location: this.location,
      userIds: this.selectedUsers.map(user => user.id)
    };


    this.isLoading = true;
    this.cadastroPescaService.gerarRelatorio(filters).subscribe((data) => {
      this.isLoading = false;

      const blob = new Blob([data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const today = new Date();
      const formattedDate = today.toISOString().replace(/T/, '_').replace(/\..+/, '');
      const fileName = `registro_financeiro_${formattedDate}.pdf`;

      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      window.URL.revokeObjectURL(url);
      this.close();
    }, error => {
      this.isLoading = false;
      if (error.status == '404') {
        this.toast.info(error.error.message, '')
      }
      this.toast.error('Erro ao gerar o relatório', '')

      console.error('Erro ao gerar o relatório:', error);
      // this.close();
    });
  }

  onDateChange(event: any) {
    const selectedDate = event.detail.value;
    if (this.currentField == 'data_inicial') {

      this.startDate = selectedDate
    } else {

      this.endDate = selectedDate
    }
    this.currentField = null;

  }
}
