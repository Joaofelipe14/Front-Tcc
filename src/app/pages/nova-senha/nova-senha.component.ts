import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-nova-senha',
  templateUrl: './nova-senha.component.html',
  styleUrls: ['./nova-senha.component.scss'],
})
export class NovaSenhaComponent implements OnInit {

  novaSenha: FormGroup;
  formattedCpf: string = '';
  nome: string = 'joao fleipe melo dal luiz';
  passwordsMatch: boolean = true; // Flag para verificar se as senhas coincidem

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private toastController: ToastController,
    private authService: AuthService,
  ) {
    this.novaSenha = this.fb.group({
      password: ['', [Validators.required]],
      confirmPassword: ['', Validators.required]
    });

    // Adiciona a verificação em tempo real para os campos de senha
    this.novaSenha.get('password')?.valueChanges.subscribe(() => this.checkPasswords());
    this.novaSenha.get('confirmPassword')?.valueChanges.subscribe(() => this.checkPasswords());
  }

  ngOnInit() { }

  // Verifica se as senhas coincidem
  private checkPasswords() {
    const password = this.novaSenha.get('password')?.value;
    const confirmPassword = this.novaSenha.get('confirmPassword')?.value;

    this.passwordsMatch = password === confirmPassword;
  }

  async onSubmit() {
    if (this.novaSenha.valid && this.passwordsMatch) {
      const formData = new FormData();
      formData.append('password', this.novaSenha.get('password')?.value);
      formData.append('confirmPassword', this.novaSenha.get('confirmPassword')?.value);

      try {
        const response = await this.authService.atualizar(formData,1).toPromise();
        console.log(response);

        if (response.dados.usuario.primeiro_acesso === "S") {
          this.router.navigate(['/nova-senha']);
        } else {
          // Lógica para redirecionamento baseado na resposta
          // const navigateTo = confirm('Deseja ir para a página colaborador?') ? '/colaborador/inicio' : '/admin/inicio';
          // this.router.navigate([navigateTo]);
        }

        // Mostrar uma mensagem de sucesso
        const toast = await this.toastController.create({
          message: 'Senha atualizada com sucesso.',
          duration: 2000,
          color: 'success'
        });
        toast.present();

      } catch (error) {
        console.error('Erro ao atualizar a senha:', error);

        // Mostrar uma mensagem de erro
        const toast = await this.toastController.create({
          message: 'Erro ao atualizar a senha. Tente novamente.',
          duration: 2000,
          color: 'danger'
        });
        toast.present();
      }
    } else if (!this.passwordsMatch) {
      const toast = await this.toastController.create({
        message: 'As senhas não coincidem.',
        duration: 2000,
        color: 'danger'
      });
      toast.present();
    }
  }
}
