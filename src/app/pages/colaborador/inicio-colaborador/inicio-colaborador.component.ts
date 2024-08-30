import { Component, OnInit } from '@angular/core';
import { CadastroPescaService } from 'src/app/services/cadastro-pesca.service';

@Component({
  selector: 'app-inicio-colaborador',
  templateUrl: './inicio-colaborador.component.html',
  styleUrls: ['./inicio-colaborador.component.scss'],
})
export class InicioColaboradorComponent implements OnInit {

  vendas: any[] = [];

  constructor(private cadastroPescaService: CadastroPescaService) { }

  ngOnInit() {
    this.loadVendas();
  }

  loadVendas(): void {
    this.cadastroPescaService.getRegistrosByUserId().subscribe(
      (response) => {
        if (response.status) {
          this.vendas = response.dados.registros.map((registro: { data_com_hora: string; local: any; codigo: any; }) => ({
            dateTime: this.formatDateTime(registro.data_com_hora),
            area: registro.local,
            code: registro.codigo
          }));
        }
      },
      (error) => {
        console.error('Erro ao carregar registros de pesca', error);
      }
    );
  }

  formatDateTime(dateTime: string): string {
    const date = new Date(dateTime);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  }
}
