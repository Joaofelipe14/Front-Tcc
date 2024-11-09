import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { ToastrService } from 'ngx-toastr';
import { CadastroPescaService } from 'src/app/services/cadastro-pesca.service';
import { LocalizacaoService } from 'src/app/services/localizacao.service';

@Component({
  selector: 'app-modal-cadastrar-pesca',
  templateUrl: './modal-cadastrar-pesca.component.html',
  styleUrls: ['./modal-cadastrar-pesca.component.scss'],
})
export class ModalCadastrarPescaComponent implements OnInit {
  cadastrarPescaForm!: FormGroup;
  localizacoes: any;
  isActive: boolean = false;
  isModalOpen: boolean = false;
  isLoading= false

  constructor(
    private formBuilder: FormBuilder,
    private modalController: ModalController,
    private cadastroPescaService: CadastroPescaService,
    private toast: ToastrService,
    private localizacaoService: LocalizacaoService
  ) {}

  onModalDismiss() {
    console.log('Modal foi fechado');
  }

  ngOnInit() {
    this.initializeForm();
    this.loadLocalizacoes();
    this.onModalDismiss()
  }

  loadLocalizacoes() {
    this.localizacaoService.getLocalizacoes().subscribe(
      (data) => {
        this.localizacoes = data.dados.registros;
        if (this.localizacoes && this.localizacoes.length > 0) {
          this.cadastrarPescaForm.patchValue({ local: this.localizacoes[0].id });
        }
      },
      (error) => {
        console.error('Erro ao carregar localizações:', error);
      }
    );
  }

  initializeForm() {
    this.cadastrarPescaForm = this.formBuilder.group({
      local: ['', Validators.required],
      data_com_hora: ['', Validators.required],
      quantidade: ['', Validators.required],
      pescado: ['', Validators.required],
    });
  }

  dismissModal() {
    this.modalController.dismiss();
  }

  async onSubmit() {

    if (this.cadastrarPescaForm.valid) {
      this.isLoading= true
      const formData = this.cadastrarPescaForm.value;

      this.cadastroPescaService.createRegistro(formData).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.toast.success('Registro criado com sucesso', 'Nova Pesca');
          this.cadastroPescaService.setPescas([response.dados.registro]);
          this.dismissModal();
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Erro ao criar registro:', error);
          this.toast.error('Erro ao criar registro', 'Error');
        }
      });
      
    }
  }



  onDateChange(event: any) {
    const selectedDate = event.detail.value;

    const dataEHorarioControl = this.cadastrarPescaForm.get('data_com_hora');
    if (dataEHorarioControl) {

      dataEHorarioControl.setValue(selectedDate);
    }
  }

 
}
