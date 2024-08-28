import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-financeiro',
  templateUrl: './financeiro.component.html',
  styleUrls: ['./financeiro.component.scss'],
})
export class FinanceiroComponent  implements OnInit {

  cadastrarFinancerioForm!: FormGroup;
  options = [
    { value: 'dia', label: 'Dia' },
    { value: 'semanal', label: 'Semanal' },
    { value: 'mes', label: 'Mês' }
  ];
  valorPeriodicidade: string = '';

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.initializeForm();
  }

  initializeForm() {
    this.cadastrarFinancerioForm = this.formBuilder.group({
      periodicidade: ['', Validators.required],
      transporte: ['', Validators.required],
      combustivel: ['', Validators.required],
      embarcacao: ['', Validators.required],
      material: ['', Validators.required],
      energia: ['', Validators.required],


    });
  }

  onSubmit() {
    if (this.cadastrarFinancerioForm.valid) {
      const formData = this.cadastrarFinancerioForm.value;
      console.log('Form Data:', formData);
    } else {
      console.log('Form is invalid');
    }
  }

  // Valor selecionado atual
  selectOption(value: string) {
    this.valorPeriodicidade = value;
    this.cadastrarFinancerioForm.patchValue({ periodicidade: value });

  }

}
