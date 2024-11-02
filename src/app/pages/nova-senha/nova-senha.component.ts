import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, MinLengthValidator, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { Utils } from 'src/app/utils/utils';

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
    private toastr: ToastrService
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
          this.isLoading = false;

          const alert = await this.alertController.create({
            header: 'Sucesso!',
            message: 'Senha atualizada com sucesso. Você será redirecionado para o login.',
            buttons: [
              {
                text: 'OK',
                handler: () => {
                  this.router.navigate(['/login']);
                }
              }
            ]
          });

          await alert.present();
        }

      } catch (error) {
        console.error('Erro ao atualizar a senha:', error);
        this.toastr.error('Tente novamente, mais tarde', 'Erro')


      }
    }
  }
}
