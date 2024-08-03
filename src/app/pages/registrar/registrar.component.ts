import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Utils } from 'src/app/utils/utils';

@Component({
  selector: 'app-registrar',
  templateUrl: './registrar.component.html',
  styleUrls: ['./registrar.component.scss'],
})
export class RegistrarComponent {
  loginForm: FormGroup;
  formattedCpf: string = '';

  constructor(private fb: FormBuilder, private router: Router, private toastController: ToastController) {
    this.loginForm = this.fb.group({
      nome: ['', Validators.required],
      contato: ['', Validators.required],
      cpf: ['', [Validators.required, Validators.pattern(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/)]],
      cap: ['', Validators.required],
      tipoUsuario: ['', Validators.required] // Novo campo

    });
  }

  async onSubmit() {
    if (this.loginForm.valid) {
      const formData = this.loginForm.value;
      // Remover caracteres não numéricos do CPF
      formData.cpf = formData.cpf.replace(/\D/g, '');
      console.log(formData);
      // Navegar ou processar o formulário aqui
    } else {
      this.loginForm.markAllAsTouched();
      let errorMessage = 'Por favor, preencha todos os campos obrigatórios e corrija os erros.';
      
      const nomeControl = this.loginForm.get('nome');
      const contatoControl = this.loginForm.get('contato');
      const cpfControl = this.loginForm.get('cpf');
      const capControl = this.loginForm.get('cap');
      
      if (nomeControl && nomeControl.invalid) {
        errorMessage += '\n- Nome é obrigatório.';
      }
      if (contatoControl && contatoControl.invalid) {
        errorMessage += '\n- Contato é obrigatório.';
      }
      if (cpfControl && cpfControl.invalid) {
        if (cpfControl.hasError('required')) {
          errorMessage += '\n- CPF é obrigatório.';
        }
        if (cpfControl.hasError('pattern')) {
          errorMessage += '\n- CPF deve estar no formato 000.000.000-00.';
        }
      }
      if (capControl && capControl.invalid) {
        errorMessage += '\n- CAP é obrigatório.';
      }
      
      await Utils.showToast(errorMessage, this.toastController,'toast-erro','alert-circle-outline');
    }
  }

  onLogin() {
    this.router.navigate(['/login']);
  }

  onCpfInput(event: any) {
    const rawValue = event.target.value;
    this.formattedCpf = Utils.formatCpf(rawValue);
    event.target.value = this.formattedCpf;
  }

  async onCpfBlur() {
    const cpfControl = this.loginForm.get('cpf');
    console.log('aqui');
    if (cpfControl && cpfControl.invalid) {
      let errorMessage = '';
      if (cpfControl.hasError('required')) {
        errorMessage = 'CPF é obrigatório.';
      }
      if (cpfControl.hasError('pattern')) {
        errorMessage = 'CPF incorreto.';
      }
      if (errorMessage) {
        await Utils.showToast(errorMessage, this.toastController,'toast-erro','alert-circle-outline');
      }
    }
  }
}
