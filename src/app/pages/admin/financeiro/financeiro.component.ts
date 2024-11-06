import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { FinancerioService } from 'src/app/services/financeiro.service';
import { CadastrarFinanceiroComponent } from './cadastrar-financeiro/cadastrar-financeiro.component';

@Component({
  selector: 'app-financeiro',
  templateUrl: './financeiro.component.html',
  styleUrls: ['./financeiro.component.scss'],
})
export class FinanceiroComponent implements OnInit {

  registrosFinanceiros: any[] = [];
  dataInicial!: string;
  dataFinal!: string;
  registrosFinanceirosFiltrados: any[] = [];
  filtroCondicao: string = 'todos';
  filtroData!: string;
  filtroDataInicial!: string;
  filtroDataFinal!: string;
  filtroExpansao: boolean = false;
  constructor(
    private financeiroService: FinancerioService,
    private loadingController: LoadingController,
    private modalController: ModalController
  ) { }

  ngOnInit() {
    this.loadFinancerio();
  }

  async openCadastroFinancerio() {
    const modal = await this.modalController.create({
      component: CadastrarFinanceiroComponent,
    });

    modal.onDidDismiss().then(() => {
      this.loadFinancerio();
    });

    return await modal.present();
  }



  toggleFiltro() {
    this.filtroExpansao = !this.filtroExpansao;
  }

  async loadFinancerio() {
    this.financeiroService.getRegistrosFinancerios().subscribe((data: any) => {
      this.registrosFinanceiros = data.registros;
      this.registrosFinanceirosFiltrados = this.registrosFinanceiros;

      console.log(data)
    }, error => {

    });
  }

  async baixarPdf(id: any) {

    const loading = await this.loadingController.create({
      message: 'Gerando pdf...',
    });
    await loading.present();

    this.financeiroService.getRelatorioFinanceiro({ ids: [id] }).subscribe((data: Blob) => {
      const blob = new Blob([data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);

      loading.dismiss();
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
    }, error => {
      // Trate o erro conforme necessário
      alert('Erro ao imprimir o pdf')
      loading.dismiss();
      console.error('Erro ao baixar o PDF', error);
    });
  }

  async imprimirAllPdf() {

    const loading = await this.loadingController.create({
      message: 'Gerando pdf...',
    });
    await loading.present();
    const idsArray: number[] = [];

    this.registrosFinanceirosFiltrados.forEach(reg => {
      idsArray.push(reg.id);
    });

    this.financeiroService.getRelatorioFinanceiro({ ids: idsArray }).subscribe((data: Blob) => {
      const blob = new Blob([data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);

      loading.dismiss();

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
    }, error => {
      alert('Erro ao imprimir o pdf')
      loading.dismiss();
      console.error('Erro ao baixar o PDF', error);
    });
  }


  filtrarRegistros() {

    console.log('filtrando')
    if (this.filtroCondicao === 'todos') {

      this.registrosFinanceirosFiltrados = this.registrosFinanceiros;
      return;
    }

    this.registrosFinanceirosFiltrados = this.registrosFinanceiros.filter(registro => {
      const dataRegistro = new Date(registro.data_inicial);

      switch (this.filtroCondicao) {
        case 'maior':
          return dataRegistro > new Date(this.filtroData);
        case 'menor':
          return dataRegistro < new Date(this.filtroData);
        case 'igual':
          return dataRegistro.toDateString() === new Date(this.filtroData).toDateString();
        case 'entre':
          const dataInicial = new Date(this.filtroDataInicial);
          const dataFinal = new Date(this.filtroDataFinal);
          return dataRegistro >= dataInicial && dataRegistro <= dataFinal;
        default:
          return true;
      }
    });
  }

}
