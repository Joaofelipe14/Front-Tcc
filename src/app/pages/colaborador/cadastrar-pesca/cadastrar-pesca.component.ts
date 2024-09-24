import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Keyboard } from '@capacitor/keyboard';
import { ToastController } from '@ionic/angular';
import { CadastroPescaService } from 'src/app/services/cadastro-pesca.service';
import { Utils } from 'src/app/utils/utils';

// Keyboard.setResizeMode('none'); // Desativa o ajuste automático do teclado

@Component({
  selector: 'app-cadastrar-pesca',
  templateUrl: './cadastrar-pesca.component.html',
  styleUrls: ['./cadastrar-pesca.component.scss'],
})
export class CadastrarPescaComponent implements OnInit {

  cadastrarPescaForm!: FormGroup;

  constructor(private formBuilder: FormBuilder, private cadastroPescaService: CadastroPescaService, private toastController: ToastController) { }

  ngOnInit() {
    this.initializeForm();
  }

  initializeForm() {
    this.cadastrarPescaForm = this.formBuilder.group({
      local: ['', Validators.required],
      data_com_hora: ['', Validators.required],
      codigo: ['', Validators.required],
    });
  }

    async onSubmit() {

      if (this.cadastrarPescaForm.valid) {
        const formData = this.cadastrarPescaForm.value;

        try {
          const response = await this.cadastroPescaService.createRegistro(formData).toPromise();
          console.log('Registro criado com sucesso:', response);
          Utils.showSucesso('Registro criado com sucesso.', this.toastController)

          this.cadastroPescaService.setPescas([response.dados.registro]); // Notifica os novos registros

        } catch (error) {
          console.error('Erro ao criar registro:', error);
          Utils.showErro('Erro ao criar registro:', this.toastController)

        }
      } else {
        console.log('Form is invalid');
      }
    }

  onDateChange(event: any) {
    const selectedDate = event.detail.value;
    // Verifica se o FormControl existe antes de usar
    const dataEHorarioControl = this.cadastrarPescaForm.get('data_com_hora');
    if (dataEHorarioControl) {
      dataEHorarioControl.setValue(selectedDate);
    }
  }

}
