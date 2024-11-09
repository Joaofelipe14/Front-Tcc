// login.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { TokenService } from 'src/app/services/token.service';
import { Utils } from 'src/app/utils/utils';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  formattedCpf: string = '';
  isLoading: boolean = false;

  versao = environment.appVersion

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private toastController: ToastController,
    private authService: AuthService,
    private tokenService: TokenService,
    private auth: AuthService,
    private toastr: ToastrService

  ) {
    this.loginForm = this.fb.group({
      cpf: ['', [Validators.required, Validators.minLength(11), Utils.cpfValidator()]],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadUserData();
  }

  loadUserData() {
    console.log("Token exists: ", this.tokenService.getToken());
    if (this.tokenService.getToken()) {
      this.auth.me().subscribe(
        response => {

          if (response.status) {
            if (response.dados.tipo_usuario === "colaborador") {
              this.router.navigate(['/colaborador/inicio']);
            } else {
              this.router.navigate(['/admin/inicio']);
            }
          }

        },
        error => {
          // Manipule erros aqui
          console.error('Erro ao obter informações do usuário:', error);

        }
      );
    }

  }
  onSubmit() {
    if (this.loginForm.valid) {

      const formData = this.loginForm.value;
      formData.cpf = Utils.unformatCpf(formData.cpf);

      const payload = {
        cpf: formData.cpf,
        password: this.loginForm.value.password
      }

      this.isLoading = true;

      this.authService.logar(payload).subscribe(
        (response: any) => {
          this.isLoading = false;

          if (response.dados.usuario.primeiro_acesso === "S") {
            this.router.navigate(['/nova-senha'], {
              state: { dataUser: response.dados }
            });
          } else {
            this.tokenService.setToken(response.dados.token)

            if (response.dados.usuario.tipo_usuario === "colaborador") {
              this.router.navigate(['/colaborador/cadastrar-pesca']);
            } else {
              this.router.navigate(['/admin/inicio']);
            }
          }
        },
        (error: any) => {
          this.isLoading = false;

          console.error('Erro ao carregar respostas:', error);

          this.toastr.error('Não foi possivel realizar o login', 'Erro')
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
        await Utils.showErro(errorMessage, this.toastController);
      }
    }
  }
}
