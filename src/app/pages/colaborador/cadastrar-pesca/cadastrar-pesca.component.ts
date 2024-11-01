import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Keyboard } from '@capacitor/keyboard';
import { ToastController } from '@ionic/angular';
import { CadastroPescaService } from 'src/app/services/cadastro-pesca.service';
import { LocalizacaoService } from 'src/app/services/localizacao.service';
import { Utils } from 'src/app/utils/utils';

// Keyboard.setResizeMode('none'); // Desativa o ajuste automático do teclado

@Component({
  selector: 'app-cadastrar-pesca',
  templateUrl: './cadastrar-pesca.component.html',
  styleUrls: ['./cadastrar-pesca.component.scss'],
})
export class CadastrarPescaComponent implements OnInit {

  cadastrarPescaForm!: FormGroup; 
  localizacoes:any;
  constructor(private formBuilder: FormBuilder, private cadastroPescaService: CadastroPescaService, private toastController: ToastController, private localizacaoService: LocalizacaoService) { }

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
        Utils.showErro('Erro ao carregar localizações', this.toastController);
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

        try {
          const response = await this.cadastroPescaService.createRegistro(formData).toPromise();
          Utils.showSucesso('Registro criado com sucesso.', this.toastController)

          this.cadastroPescaService.setPescas([response.dados.registro]); 

        } catch (error) {
          console.error('Erro ao criar registro:', error);
          Utils.showErro('Erro ao criar registro:', this.toastController)

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
