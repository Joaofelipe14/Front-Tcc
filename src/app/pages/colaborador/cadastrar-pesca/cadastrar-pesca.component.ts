import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-cadastrar-pesca',
  templateUrl: './cadastrar-pesca.component.html',
  styleUrls: ['./cadastrar-pesca.component.scss'],
})
export class CadastrarPescaComponent  implements OnInit {

  cadastrarPescaForm!: FormGroup;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.initializeForm();
  }

  initializeForm() {
    this.cadastrarPescaForm = this.formBuilder.group({
      local: ['', Validators.required],
      dataEHorario: ['', Validators.required],
      codigo: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.cadastrarPescaForm.valid) {
      const formData = this.cadastrarPescaForm.value;
      console.log('Form Data:', formData);
    } else {
      console.log('Form is invalid');
    }
  }

  onDateChange(event: any) {
    const selectedDate = event.detail.value;
    // Verifica se o FormControl existe antes de usar
    const dataEHorarioControl = this.cadastrarPescaForm.get('dataEHorario');
    if (dataEHorarioControl) {
      dataEHorarioControl.setValue(selectedDate);
    }
  }
  
}
