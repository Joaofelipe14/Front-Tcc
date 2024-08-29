import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { Utils } from 'src/app/utils/utils';

@Component({
  selector: 'app-registrar',
  templateUrl: './registrar.component.html',
  styleUrls: ['./registrar.component.scss'],
})
export class RegistrarComponent {
  loginForm: FormGroup;
  formattedCpf: string = '';
  selectedImage: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;
  private copyAlert: HTMLIonAlertElement | null = null;  // Referência para o alerta de cópia


  constructor(
    private fb: FormBuilder,
    private router: Router,
    private toastController: ToastController,
    private authService: AuthService,
    private alertController: AlertController
  ) {
    this.loginForm = this.fb.group({
      nome: ['', Validators.required],
      contato: ['', Validators.required],
      cpf: ['', [Validators.required, Validators.pattern(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/)]],
      cap: ['', Validators.required],
      tipo_usuario: ['', Validators.required]
    });
  }


  async onSubmit() {
    if (this.loginForm.valid) {
      const formData = this.loginForm.value;
      // Remover caracteres não numéricos do CPF
      this.loginForm.get('cpf')?.setValue(this.loginForm.get('cpf')?.value.replace(/\D/g, ''));
      this.loginForm.get('contato')?.setValue(this.loginForm.get('contato')?.value.replace(/\D/g, ''));

      const novoformData = new FormData();
      novoformData.append('nome', this.loginForm.get('nome')?.value);
      novoformData.append('cpf', this.loginForm.get('cpf')?.value);
      novoformData.append('cap', this.loginForm.get('cap')?.value);
      novoformData.append('contato', this.loginForm.get('contato')?.value);
      novoformData.append('tipo_usuario', this.loginForm.get('tipo_usuario')?.value);

      if (this.selectedFile) {
        novoformData.append('profile_image', this.selectedFile);
      }

      try {

        const response = await this.authService.cadastrar(novoformData).toPromise();
        if (response.dados.senha) {
          this.showAlertWithCopy((response.dados.senha))
        }
        console.log('Usuário cadastrado com sucesso', response.dados.senha);

      } catch (error) {
        console.error('Erro ao cadastrar usuário', error);
        await Utils.showToast('Erro ao cadastrar contra, tente novamente mais tarde.', this.toastController, 'toast-erro', 'alert-circle-outline');
      }

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

      await Utils.showToast(errorMessage, this.toastController, 'toast-erro', 'alert-circle-outline');
    }
  }

  onLogin() {
    this.router.navigate(['/login']);
  }


  async showAlertWithCopy(senha: string) {
    this.copyAlert = await this.alertController.create({
      header: 'Cadastro realizado ☑',
      message: 'Senha ' + senha + ' gerada.',
      buttons: [
        {
          text: 'Copiar Valor',
          handler: async () => {
            const valorParaCopiar = senha;
            try {
              await navigator.clipboard.writeText(valorParaCopiar);
              await this.presentConfirmationAlert();
            } catch (err) {
              console.error('Falha ao copiar: ', err);
            }
            return false;
          }
        }
      ],
      backdropDismiss: false
    });

    await this.copyAlert.present();
  }

  async presentConfirmationAlert() {
    const confirmationAlert = await this.alertController.create({
      header: 'Cadastro realizado!!',
      message: 'Acesse sua conta',
      buttons: [
        {
          text: 'OK',
          handler: () => {
            this.copyAlert?.dismiss();
            this.onLogin();
          }
        }
      ]
    });

    await confirmationAlert.present();
  }


  onCpfInput(event: any) {
    const rawValue = event.target.value;
    this.formattedCpf = Utils.formatCpf(rawValue);
    event.target.value = this.formattedCpf;
  }

  async onCpfBlur() {
    const cpfControl = this.loginForm.get('cpf');
    if (cpfControl && cpfControl.invalid) {
      let errorMessage = '';
      if (cpfControl.hasError('required')) {
        errorMessage = 'CPF é obrigatório.';
      }
      if (cpfControl.hasError('pattern')) {
        errorMessage = 'CPF incorreto.';
      }
      if (errorMessage) {
        await Utils.showToast(errorMessage, this.toastController, 'toast-erro', 'alert-circle-outline');
      }
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.selectedFile = file;
      const reader = new FileReader();

      console.log(file)
      reader.onload = () => {
        this.selectedImage = reader.result;
      };

      reader.readAsDataURL(file);
    }
  }

  removeImage(event: Event) {
    event.stopPropagation();
    this.selectedImage = null;
    this.selectedFile = null;
    // Limpa o campo de entrada de arquivo
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }


  applyPhoneMask(event: any): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');

    if (value.length > 0) {
      value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
    }
    if (value.length > 10) {
      value = value.replace(/(\d{5})(\d{4})$/, '$1-$2');
    }

    input.value = value;
    this.loginForm.get('contato')?.setValue(value);
  }
}
