import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-meu-perfil',
  templateUrl: './meu-perfil.component.html',
  styleUrls: ['./meu-perfil.component.scss'],
})
export class MeuPerfilComponent implements OnInit {
  meuPerfilForm: FormGroup;
  selectedImage: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;

  constructor(private formBuilder: FormBuilder) {
    this.meuPerfilForm = this.formBuilder.group({
      nome: ['', Validators.required],
      cpf: [{ value: '', disabled: true }],
      cap: ['', Validators.required],
      contato: ['', Validators.required],
      tipoUsuario: ['', Validators.required],
      imagemPerfil: [null] 
    });
  }

  ngOnInit() {
    this.loadUserData();
  }

  loadUserData() {
    // Dados mockados do colaborador
    const userData = {
      nome: 'João',
      cpf: '123.456.789-00',
      cap: '54321-678',
      contato: '(21) 98765-4321',
      tipoUsuario: 'colaborador',
      imagemPerfil: 'https://img.freepik.com/fotos-premium/icone-de-ilustracao-de-desenho-animado-de-naruto_1070876-6904.jpg'
    };

    this.meuPerfilForm.patchValue(userData);
    this.selectedImage = userData.imagemPerfil;
  }

  onSubmit() {
    if (this.meuPerfilForm.valid) {
      const formData = new FormData();
      Object.keys(this.meuPerfilForm.value).forEach(key => {
        formData.append(key, this.meuPerfilForm.value[key]);
      });

      if (this.selectedFile) {
        formData.append('imagemPerfil', this.selectedFile, this.selectedFile.name);
      }

      // Log do conteúdo do FormData
      formData.forEach((value, key) => {
        console.log(`${key}:`, value);
      });
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
