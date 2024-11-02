import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { ToastrService } from 'ngx-toastr';
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


  isModalOpen: boolean = false;
  campoEditado: string = '';
  campoValor: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private toast: ToastrService,
    private alertController: AlertController

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

  maskContato(event: any) {
    const input = event.target as HTMLInputElement;
    const contatoFormatado = Utils.applyPhoneMask(input.value)
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

      novoformData.forEach((value, key) => {
        console.log(`${key}:`, value);
      });


      try {
        const response = await this.auth.atualizar(novoformData, this.userId).toPromise();

        if (response.sucesso) {

          this.toast.success("Daddos atualizados", 'Sucesso')
        }

      } catch (error) {
        console.error('Erro ao atualizar a senha:', error);
        this.toast.error("Tente novamente mais tarde", 'Erro')

      }
    }
  }



  async onFileSelected(event: Event) {
    const alert = await this.alertController.create({
      header: 'Confirmar',
      message: 'Deseja alterar a foto de perfil?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Confirmar',
          handler: () => {

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

            this.onSubmit()

          },
        },
      ],
    });

    await alert.present();
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

  openModal(campo: string) {
    this.campoEditado = campo;
    this.campoValor = this.meuPerfilForm.get(campo)?.value || '';
    this.isModalOpen = true;
  }

  dismissModal() {
    this.isModalOpen = false;
  }

  async updateField() {
    if (this.campoEditado) {
      this.meuPerfilForm.get(this.campoEditado)?.setValue(this.campoValor);
      console.log(`Valor atualizado para o campo ${this.campoEditado}: ${this.campoValor}`);

      this.onSubmit();
    }
    this.dismissModal();
  }

  onInputChange(event: any) {
    this.campoValor = event.detail.value;
  }



}
