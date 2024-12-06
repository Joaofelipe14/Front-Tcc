import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { ToastrService } from 'ngx-toastr';
import { CadastroVendaService } from 'src/app/services/cadastro-venda.service';
import { LocalizacaoService } from 'src/app/services/localizacao.service';

@Component({
  selector: 'app-modal-cadastrar-venda',
  templateUrl: './modal-cadastrar-venda.component.html',
  styleUrls: ['./modal-cadastrar-venda.component.scss'],
})
export class ModalCadastrarVendaComponent implements OnInit {

  cadastrarVendaForm!: FormGroup;
  localizacoes: any
  isLoading = false

  constructor(
    private formBuilder: FormBuilder,
    private cadastroVendaService: CadastroVendaService,
    private localizacaoService: LocalizacaoService,
    private toast: ToastrService,
    private modalController: ModalController
  ) { }
  ngOnInit() {
    this.initializeForm();
    this.loadLocalizacoes();
    window.history.pushState({ modal: true }, '')
    window.addEventListener('popstate', this.handleBack.bind(this))
  }

  handleBack() {
    this.dismissModal()
  }

  ngOnDestroy() {
    console.log('componente sendo destruido')
    window.addEventListener('popstate', this.handleBack.bind(this))
  }


  loadLocalizacoes() {
    this.localizacaoService.getLocalizacoes().subscribe(
      (data) => {
        this.localizacoes = data.dados.registros;
        console.log('Localizações carregadas:', this.localizacoes);
        if (this.localizacoes && this.localizacoes.length > 0) {
          this.cadastrarVendaForm.patchValue({ ponto_venda: this.localizacoes[0].id });
        }
      },
      (error) => {
        console.error('Erro ao carregar localizações:', error);
      }
    );
  }

  dismissModal() {
    this.modalController.dismiss();
  }


  initializeForm() {
    this.cadastrarVendaForm = this.formBuilder.group({
      ponto_venda: ['', Validators.required],
      quantidade: ['', Validators.required],
      valor: ['', Validators.required],
    });
  }


  async onSubmit() {
    if (this.cadastrarVendaForm.valid) {
      const formData = this.cadastrarVendaForm.value;
      this.isLoading = false;

      try {
        this.cadastroVendaService.createRegistro(formData).subscribe({
          next: (response) => {
            this.isLoading = false;
            this.toast.success('Registro criado com sucesso', 'Nova venda');
            this.cadastroVendaService.setvendas([response.dados.registro]);
            this.dismissModal();
          },
          error: (error) => {
            this.isLoading = false;
            console.error('Erro ao criar registro:', error);
            this.toast.error('Erro ao criar registro', 'Error');
          }
        });
      } catch (error) {
        this.isLoading = false;
        console.error('Erro inesperado:', error);
        this.toast.error('Erro inesperado', 'Error');
      }

    }
  }

}
