import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { CadastroVendaService } from 'src/app/services/cadastro-venda.service';
import { Utils } from 'src/app/utils/utils';
@Component({
  selector: 'app-cadastrar-venda',
  templateUrl: './cadastrar-venda.component.html',
  styleUrls: ['./cadastrar-venda.component.scss'],
})
export class CadastrarVendaComponent  implements OnInit {

  cadastrarVendaForm!: FormGroup;

  constructor(private formBuilder: FormBuilder, private cadastroVendaService: CadastroVendaService, private toastController: ToastController) {}

  ngOnInit() {
    this.initializeForm();
  }

  initializeForm() {
    this.cadastrarVendaForm = this.formBuilder.group({
      ponto_venda: ['', Validators.required],
      quantidade: ['', Validators.required],
      valor: ['', Validators.required],
    });
  }

 async onSubmit() {
    if (this.cadastrarVendaForm.valid) {
      const formData = this.cadastrarVendaForm.value;

      try {
      const response = await this.cadastroVendaService.createRegistro(formData).toPromise();
      Utils.showSucesso('Registro criado com sucesso.', this.toastController)
      this.cadastroVendaService.setvendas([response.dados.registro]); 

    } catch (error) {
      console.error('Erro ao criar registro:', error);
      Utils.showErro('Erro ao criar registro:', this.toastController)

    }
    } 
  }

  onDateChange(event: any) {
    const selectedDate = event.detail.value;
    // Verifica se o FormControl existe antes de usar
    const dataEHorarioControl = this.cadastrarVendaForm.get('data_com_hora');
    if (dataEHorarioControl) {
      dataEHorarioControl.setValue(selectedDate);
    }
  }

}
