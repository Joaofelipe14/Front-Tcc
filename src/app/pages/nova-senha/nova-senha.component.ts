import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, MinLengthValidator, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
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
  nome: string = '';
  passwordsMatch: boolean = false;
  userId!: number;


  constructor(
    private fb: FormBuilder,
    private router: Router,
    private toastController: ToastController,
    private authService: AuthService,
    private route: ActivatedRoute,
    private alertController: AlertController
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
    this.userId = this.route.snapshot.params["id"]
  }

  // Verifica se as senhas coincidem
  public checkPasswords() {
    const password = this.novaSenha.get('password')?.value;
    const confirmPassword = this.novaSenha.get('confirmPassword')?.value;
    this.passwordsMatch = password === confirmPassword;
  }

  async erroMsg() {
    if (!this.passwordsMatch) {
      Utils.showErro('As senhas não coincidem.', this.toastController)
    }
  }


  async onSubmit() {
    if (this.novaSenha.valid) {
      const formData = new FormData();
      formData.append('password', this.novaSenha.get('password')?.value);
      formData.append('password_confirmation', this.novaSenha.get('confirmPassword')?.value);
      formData.append('primeiro_acesso', 'N');

      try {
        const response = await this.authService.atualizar(formData, this.userId).toPromise();

        if (response.sucesso) {
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
        Utils.showErro('Erro ao atualizar a senha. Tente novamente.', this.toastController)

      }
    }
  }
}
