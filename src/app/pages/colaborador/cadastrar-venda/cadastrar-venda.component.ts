import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { ToastrService } from 'ngx-toastr';
import { CadastroVendaService } from 'src/app/services/cadastro-venda.service';
import { LocalizacaoService } from 'src/app/services/localizacao.service';
import { Utils } from 'src/app/utils/utils';
@Component({
  selector: 'app-cadastrar-venda',
  templateUrl: './cadastrar-venda.component.html',
  styleUrls: ['./cadastrar-venda.component.scss'],
})
export class CadastrarVendaComponent implements OnInit {

  cadastrarVendaForm!: FormGroup;
  localizacoes: any
  isLoading = false

  constructor(
    private formBuilder: FormBuilder, 
    private cadastroVendaService: CadastroVendaService, 
    private toastController: ToastController, 
    private localizacaoService: LocalizacaoService, 
    private toast: ToastrService
  ) { }
  ngOnInit() {
    this.initializeForm();
    this.loadLocalizacoes();
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

      try {
        this.isLoading = false;

        const response = await this.cadastroVendaService.createRegistro(formData).toPromise();
        this.toast.success('Registro criado com sucesso', 'Nova venda')
        this.cadastroVendaService.setvendas([response.dados.registro]);
      } catch (error) {
        this.isLoading = false;
        console.error('Erro ao criar registro:', error);
        this.toast.error('Erro ao criar registro', 'Error')

      }
    }
  }

  onDateChange(event: any) {
    const selectedDate = event.detail.value;
    // Verifica se o FormControl existe antes de usar
    const dataEHorarioControl = this.cadastrarVendaForm.get('data_com_hora');
    if (dataEHorarioControl) {
      dataEHorarioControl.setValue(selectedDate);
    }
  }

}
