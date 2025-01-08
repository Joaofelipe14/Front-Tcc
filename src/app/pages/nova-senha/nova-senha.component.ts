import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-nova-senha',
  templateUrl: './nova-senha.component.html',
  styleUrls: ['./nova-senha.component.scss'],
})
export class NovaSenhaComponent implements OnInit {

  novaSenha: FormGroup;
  formattedCpf: string = '';
  passwordsMatch: boolean = false;
  dataUser!: any;
  token!: string;
  isLoading = false


  constructor(
    private fb: FormBuilder,
    private router: Router,
    private toastController: ToastController,
    private authService: AuthService,
    private alertController: AlertController,
    private toastr: ToastrService,
    private tokenService: TokenService
  ) {
    this.novaSenha = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    });

    this.novaSenha.valueChanges.subscribe(() => {
      this.checkPasswords();
    });

  }

  ngOnInit() {


    const navigation = this.router.getCurrentNavigation();
    if (navigation && navigation.extras.state) {
      this.dataUser = navigation.extras.state?.['dataUser'].usuario;
      this.token = navigation.extras.state?.['dataUser'].token;
    }
  }

  // Verifica se as senhas coincidem
  public checkPasswords() {
    const password = this.novaSenha.get('password')?.value;
    const confirmPassword = this.novaSenha.get('confirmPassword')?.value;
    this.passwordsMatch = password === confirmPassword;
  }

  async erroMsg() {
    if (!this.passwordsMatch) {
      this.toastr.error('As senhas não coincidem.', 'Erro')
    }
  }

  async fazerLogin(payload: any) {
    this.authService.logar(payload).subscribe(
      async (response: any) => {
        this.tokenService.setToken(response.dados.token)

        const alert = await this.alertController.create({
          header: 'Sucesso!',
          message: 'Senha atualizada com sucesso. Você será redirecionado para a tela inicial.',
          buttons: [
            {
              text: 'OK',
              
            }
          ]
        });

        alert.onDidDismiss().then(() => {
          if (response.dados.usuario.tipo_usuario === "colaborador") {
            this.router.navigate(['/colaborador/cadastrar-pesca']);
          } else {
            this.router.navigate(['/admin/inicio']);
          }
        });

        this.isLoading = false;

        await alert.present();


      },
      (error: any) => {
        this.isLoading = false;
        console.error('Erro ao carregar respostas:', error);
        this.toastr.error('Não foi possivel realizar o login', 'Erro')
      }
    );

  }

  async onSubmit() {
    if (this.novaSenha.valid) {
      const formData = new FormData();
      formData.append('password', this.novaSenha.get('password')?.value);
      formData.append('password_confirmation', this.novaSenha.get('confirmPassword')?.value);
      formData.append('primeiro_acesso', 'N');

      try {
        this.isLoading = true;
        const response = await this.authService.atualizarSemTokenLocal(formData, this.dataUser.id, this.token).toPromise();

        if (response.sucesso) {

          const payload = {
            cpf: this.dataUser.cpf,
            password: this.novaSenha.get('confirmPassword')?.value
          }

          await this.fazerLogin(payload)


        }

      } catch (error) {
        console.error('Erro ao atualizar a senha:', error);
        this.toastr.error('Tente novamente, mais tarde', 'Erro')


      }
    }
  }
}
