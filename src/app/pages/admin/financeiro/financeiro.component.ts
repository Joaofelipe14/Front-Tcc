import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { FinancerioService } from 'src/app/services/financeiro.service';
import { Utils } from 'src/app/utils/utils';

@Component({
  selector: 'app-financeiro',
  templateUrl: './financeiro.component.html',
  styleUrls: ['./financeiro.component.scss'],
})
export class FinanceiroComponent implements OnInit {

  cadastrarFinancerioForm!: FormGroup;
  selectedSegment: string = 'cadastro';
  currentField: string | null = null;
  private originalEnergyValue: any | null = null;
  registrosFinanceiros: any[] = []; // Adiciona esta linha



  constructor(private formBuilder: FormBuilder, private financeiroService: FinancerioService, private toastController: ToastController) { }

  ngOnInit() {
    this.initializeForm();
    this.loadFinancerio();
  }

  initializeForm() {
    this.cadastrarFinancerioForm = this.formBuilder.group({
      transporte: ['', Validators.required],
      combustivel: ['', Validators.required],
      embarcacao: ['', Validators.required],
      material: ['', Validators.required],
      energia: ['', [Validators.required, Validators.pattern(/^\d+([.,]\d+)? kw$/)]],
      data_inicial: ['', Validators.required],
      data_final: ['', Validators.required],
    });
  }

  onDateChange(event: any) {
    const selectedDate = event.detail.value;
    if (this.currentField) {
      this.cadastrarFinancerioForm.get(this.currentField)?.setValue(selectedDate);
    }
    this.currentField = null;
  }


  formatEnergy() {
    const energyControl = this.cadastrarFinancerioForm.get('energia');
    this.originalEnergyValue = energyControl?.value;

    if (energyControl && energyControl.value) {
      const value = energyControl.value.replace(',', '.').trim();
      const formattedValue = `${parseFloat(value).toFixed(2)} kw`;
      energyControl.setValue(formattedValue);
    }

  }

  async onSubmit() {
    if (this.cadastrarFinancerioForm.valid) {
      const formData = this.cadastrarFinancerioForm.value;
      formData.energia = this.originalEnergyValue;

      try {
        const response = await this.financeiroService.createRegistroFinanceiro(formData).toPromise();

        if (response.sucesso) {
          Utils.showSucesso("Dados atualizado", this.toastController)
        }

      } catch (error) {
        console.error('Erro:', error);
        Utils.showErro('Erro . Tente novamente mais tarde.', this.toastController)

      }


    } else {
      console.log('Formulário inválido');
    }
  }

  segmentChanged() {
    // Lógica para manipular mudanças no segmento
  }


  dataInicial!: string;
  dataFinal!: string;
  registrosFinanceirosFiltrados: any[] = [];

  async loadFinancerio() {
    // const loading = await this.loadingController.create({
    //   message: 'Carregando usuários...',
    // });
    // await loading.present();

    this.financeiroService.getRegistrosFinancerios().subscribe((data: any) => {
      this.registrosFinanceiros = data.registros; // Armazena os registros

      console.log(data)
      // loading.dismiss();
    }, error => {
      // loading.dismiss();
      // Trate o erro conforme necessário
    });
  }

// seu-componente.ts
baixarPdf(id: any) {
  this.financeiroService.getRelatorioFinanceiro({ ids: [id] }).subscribe((data: Blob) => {
    const blob = new Blob([data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'registros_financeiros.pdf'; 
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url); 
  }, error => {
    // Trate o erro conforme necessário
    console.error('Erro ao baixar o PDF', error);
  });
}


}
