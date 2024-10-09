import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { Utils } from 'src/app/utils/utils';


@Component({
  selector: 'app-meu-perfil',
  templateUrl: './meu-perfil.component.html',
  styleUrls: ['./meu-perfil.component.scss'],
})
export class MeuPerfilComponent implements OnInit {
  meuPerfilForm: FormGroup;
  selectedImage: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;
  userId!: number

  constructor(
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private toastController: ToastController
  ) {
    this.meuPerfilForm = this.formBuilder.group({
      nome: ['', Validators.required],
      cpf: [{ value: '', disabled: true }],
      cap: ['', Validators.required],
      contato: ['', Validators.required],
      tipoUsuario: [{ value: '', disabled: true }],
      imagemPerfil: [null]
    });
  }

  ngOnInit() {
    this.loadUserData();
  }

  loadUserData() {
    this.auth.me().subscribe(
      response => {

        if (response.status) {
          this.userId = response.dados.id
          const userData = {
            nome: response.dados.name,
            cpf: Utils.formatCpf(response.dados.cpf),
            cap: response.dados.cap,
            contato: Utils.applyPhoneMask(response.dados.contato),
            tipoUsuario: response.dados.tipo_usuario,
            imagemPerfil: response.dados.url_perfil
          };
          this.meuPerfilForm.patchValue(userData);
          this.selectedImage = userData.imagemPerfil;
        }

      },
      error => {
        // Manipule erros aqui
        console.error('Erro ao obter informações do usuário:', error);

      }
    );
  }

  maskContato(event: any){
    const input = event.target as HTMLInputElement;

    const  contatoFormatado = Utils.applyPhoneMask(input.value)
    this.meuPerfilForm.get('contato')?.setValue(contatoFormatado);

  }
  async onSubmit() {
    if (this.meuPerfilForm.valid) {

      const novoformData = new FormData();
      novoformData.append('name', this.meuPerfilForm.get('nome')?.value);
      novoformData.append('cap', this.meuPerfilForm.get('cap')?.value);
      novoformData.append('contato', this.meuPerfilForm.get('contato')?.value.replace(/\D/g, ''));

      if (this.selectedFile) {
        novoformData.append('profile_image', this.selectedFile);
      }


      // Log do conteúdo do FormData
      novoformData.forEach((value, key) => {
        console.log(`${key}:`, value);
      });


      try {
        const response = await this.auth.atualizar(novoformData, this.userId).toPromise();

        if (response.sucesso) {  
        Utils.showSucesso("Dados atualizado",this.toastController)
        }

      } catch (error) {
        console.error('Erro ao atualizar a senha:', error);
        Utils.showErro('Erro ao atualizar a dados. Tente novamente mais tarde.', this.toastController)

      }
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.selectedFile = file;
      const reader = new FileReader();

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
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }


}
