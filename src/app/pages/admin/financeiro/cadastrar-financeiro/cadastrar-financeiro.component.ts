
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingController, ModalController, ToastController } from '@ionic/angular';
import { ToastrService } from 'ngx-toastr';
import { FinancerioService } from 'src/app/services/financeiro.service';

@Component({
  selector: 'app-cadastrar-financeiro',
  templateUrl: './cadastrar-financeiro.component.html',
  styleUrls: ['./cadastrar-financeiro.component.scss'],
})
export class CadastrarFinanceiroComponent implements OnInit {

  cadastrarFinancerioForm!: FormGroup;
  selectedSegment: string = 'cadastro';
  currentField: string | null = null;
  private originalEnergyValue: any | null = null;
  registrosFinanceiros: any[] = [];

  isLoading = false;

  constructor(
    private formBuilder: FormBuilder,
    private financeiroService: FinancerioService,
    private toast: ToastrService,
    private modalController: ModalController
  ) { }

  ngOnInit() {
    this.initializeForm();
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

    const formData = this.cadastrarFinancerioForm.value;
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
    const formData = this.cadastrarFinancerioForm.value;
    if (this.cadastrarFinancerioForm.valid) {
      const formData = this.cadastrarFinancerioForm.value;
      formData.energia = this.originalEnergyValue;
      this.isLoading = true;

      try {
        const response = await this.financeiroService.createRegistroFinanceiro(formData).toPromise();
        this.isLoading = false;

        if (response.sucesso) {
          this.toast.success('Registro financeiro criado.', 'Sucesso');
          this.dismissModal();
        }

      } catch (error) {
        console.error('Erro:', error);
        this.isLoading = false;

        this.toast.error('Erro ao criar registro.', 'Error');
      }
    } else {
      console.log('Formulário inválido');
    }
  }


  dismissModal() {
    this.modalController.dismiss();
  }
}
