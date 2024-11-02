import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { ToastrService } from 'ngx-toastr';
import { CadastroPescaService } from 'src/app/services/cadastro-pesca.service';
import { LocalizacaoService } from 'src/app/services/localizacao.service';

@Component({
  selector: 'app-cadastrar-pesca',
  templateUrl: './cadastrar-pesca.component.html',
  styleUrls: ['./cadastrar-pesca.component.scss'],
})
export class CadastrarPescaComponent implements OnInit {

  cadastrarPescaForm!: FormGroup;
  localizacoes: any;
  isLoading = false
  constructor(
    private formBuilder: FormBuilder,
    private cadastroPescaService: CadastroPescaService,
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

  async onSubmit() {

    if (this.cadastrarPescaForm.valid) {
      const formData = this.cadastrarPescaForm.value;

      this.isLoading = true;
      try {
        const response = await this.cadastroPescaService.createRegistro(formData).toPromise();

        this.isLoading = false;
        this.toast.success('Registro criado com sucesso', 'Nova Pesca')
        this.cadastroPescaService.setPescas([response.dados.registro]);

      } catch (error) {
        this.isLoading = false;
        console.error('Erro ao criar registro:', error);
        this.toast.error('Erro ao criar registro', 'Error')


      }
    } else {
    }
  }

  onDateChange(event: any) {
    const selectedDate = event.detail.value;
    // Verifica se o FormControl existe antes de usar
    const dataEHorarioControl = this.cadastrarPescaForm.get('data_com_hora');
    if (dataEHorarioControl) {
      dataEHorarioControl.setValue(selectedDate);
    }
  }

}
