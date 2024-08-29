// login.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { TokenService } from 'src/app/services/token.service';
import { Utils } from 'src/app/utils/utils';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  formattedCpf: string = '';

  constructor(
    private fb: FormBuilder, 
    private router: Router,
    private toastController: ToastController,
    private authService: AuthService,
    private tokenService: TokenService  
  ) { 
    this.loginForm = this.fb.group({
      cpf: ['', [Validators.required, Validators.pattern(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/)]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
    
      const formData = this.loginForm.value;
      formData.cpf = Utils.unformatCpf(formData.cpf);

      const payload  = {
        cpf: formData.cpf,
        password: this.loginForm.value.password 
      }
      this.authService.logar(payload).subscribe(
        (response: any) => {
          console.log(response)
          this.tokenService.setToken(response.dados.token)

          if(response.dados.usuario.primeiro_acesso==="S"){
            this.router.navigate(['/nova-senha']);
          }else{

               // if (confirm('Deseja ir para a página colaborador?')) {
      //   this.router.navigate(['/colaborador/inicio']);
      // } else {
      //   this.router.navigate(['/admin/inicio']);
      // }
          }
        },
        (error: any) => {
          console.error('Erro ao carregar respostas:', error);
           Utils.showToast('Erro fazer login, tente novamente mais tarde.', this.toastController, 'toast-erro', 'alert-circle-outline');

        }
      );
      
   
    }
  }

  onRegister() {
    this.router.navigate(['/registrar']);
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
        await Utils.showToast(errorMessage, this.toastController,'toast-erro','alert-circle-outline');
      }
    }
  }
}
