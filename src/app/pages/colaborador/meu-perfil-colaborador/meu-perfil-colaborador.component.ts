import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-meu-perfil-colaborador',
  templateUrl: './meu-perfil-colaborador.component.html',
  styleUrls: ['./meu-perfil-colaborador.component.scss'],
})
export class MeuPerfilColaboradorComponent implements OnInit {
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
    });
  }

  ngOnInit() {
    this.loadUserData();
  }

  loadUserData() {
    // Dados mockados do colaborador
    const userData = {
      nome: 'Maria Oliveira',
      cpf: '123.456.789-00',
      cap: '54321-678',
      contato: '(21) 98765-4321',
      tipoUsuario: 'colaborador',
    };

    this.meuPerfilForm.patchValue(userData);
  }

  onSubmit() {
    if (this.meuPerfilForm.valid) {
      console.log(this.meuPerfilForm.value);
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
    event.stopPropagation(); // Evita que o clique na imagem também abra o input de arquivos
    this.selectedImage = null;
    this.selectedFile = null;
    // Limpa o campo de entrada de arquivo
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }
}
