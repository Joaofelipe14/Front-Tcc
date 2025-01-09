// login.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { TokenService } from 'src/app/services/token.service';
import { VersaoService } from 'src/app/services/version.service';
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

  verPaginaLogin: boolean = true;

  versao: string =''

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private toastController: ToastController,
    private authService: AuthService,
    private tokenService: TokenService,
    private auth: AuthService,
    private toastr: ToastrService,
    private loadingController: LoadingController,
   private serviceVersao : VersaoService

  ) {
    this.loginForm = this.fb.group({
      cpf: ['', [Validators.required, Validators.minLength(11), Utils.cpfValidator()]],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.getVersion();
    this.loadUserData();
  }

  async loadUserData() {
    console.log("Token exists: ", this.tokenService.getToken());
    if (this.tokenService.getToken()) {


      const loading = await this.loadingController.create({
        message: 'Acessando...',
      });
      await loading.present();

      this.verPaginaLogin = false;

      this.auth.me().subscribe(
        response => {
          loading.dismiss();
          this.verPaginaLogin =true;
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
         
          console.log("Token exists: ", this.tokenService.getToken());
          this.tokenService.remove()
          this.verPaginaLogin = false;
          loading.dismiss();
          console.error('Erro ao obter informações do usuário:', error);

        }
      );
    }

  }

  getVersion(){
    this.serviceVersao.getVersao().subscribe(
      (response) => {
        this.versao = response.version;

        console.log('Versão da aplicação:', this.versao);

        this.checkVersion();
      },
      (error) => {
        console.error('Erro ao buscar versão:', error);
      }
    );
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

  checkVersion(): void {
    const currentAppVersion = this.versao;
    const storedVersion = localStorage.getItem('appVersion');
  
    if (storedVersion === null) {
      localStorage.setItem('appVersion', currentAppVersion);
      return;
    }
      if (currentAppVersion !== storedVersion) {
  
      const toast = this.toastr.info('Uma nova versão está disponível. Clique para atualizar.', 'Nova versão', {
        timeOut: 0, 
        progressBar: true,
        closeButton: true,
        disableTimeOut: true
      });
  
      toast.onTap.subscribe(() => {
        localStorage.setItem('appVersion', currentAppVersion);
        window.location.reload();
      });
    } else {
      console.log('Versão já está atual.');
    }
  }
}
