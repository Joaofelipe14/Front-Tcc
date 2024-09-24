import { Component, OnInit } from '@angular/core';
import { CadastroPescaService } from 'src/app/services/cadastro-pesca.service';
import { CadastroVendaService } from 'src/app/services/cadastro-venda.service';

@Component({
  selector: 'app-inicio-colaborador',
  templateUrl: './inicio-colaborador.component.html',
  styleUrls: ['./inicio-colaborador.component.scss'],
})
export class InicioColaboradorComponent implements OnInit {
  registros: any[] = []; // Array para armazenar pescas e vendas combinados

  constructor(private cadastroPescaService: CadastroPescaService, private cadastroVendaService: CadastroVendaService) { }

  ngOnInit() {
    this.loadPesca();
    this.loadVendas();

    this.cadastroPescaService.pescas$.subscribe(pescas => {
      if ([pescas]) {
        this.updateRegistros(pescas, 'pesca');
      }
    });

    this.cadastroVendaService.vendas$.subscribe(pescas => {
      if ([pescas]) {
        this.updateRegistros(pescas, 'venda');
      }
    });

  }

  loadPesca(): void {
    this.cadastroPescaService.getRegistrosByUserId().subscribe(
      (response) => {
        if (response.status) {
          const pescas = response.dados.registros.map((registro: { data_com_hora: string; local: any; codigo: any; }) => ({
            dateTime: new Date(registro.data_com_hora).getTime(),
            local: registro.local,
            codigo: registro.codigo,
            type: 'pesca'
          }));
          this.registros = [...this.registros, ...pescas];
          this.sortRegistros();
        }
      },
      (error) => {
        console.error('Erro ao carregar registros de pesca', error);
      }
    );
  }

  loadVendas(): void {
    this.cadastroVendaService.getRegistrosByUserId().subscribe(
      (response) => {
        if (response.status) {
          const vendas = response.dados.registros.map((registro: {
            created_at: string; ponto_venda: any; quantidade: any; valor: any
          }) => ({
            dateTime: new Date(registro.created_at).getTime(),
            ponto_venda: registro.ponto_venda,
            quantidade: registro.quantidade,
            valor: registro.valor,
            type: 'venda'
          }));
          this.registros = [...this.registros, ...vendas];
          this.sortRegistros();
        }
      },
      (error) => {
        console.error('Erro ao carregar registros de vendas', error);
      }
    );
  }

  sortRegistros(): void {
    this.registros.sort((a, b) => {
      return new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime();
    });
  }

  updateRegistros(newRecords: any[], type: string): void {
    const updatedRecords = newRecords.map(record => ({
      ...record,
      type: type,
      dateTime: type === 'pesca' ? record.data_com_hora : record.created_at
    }));

    this.registros = [...this.registros, ...updatedRecords];
    this.sortRegistros();
  }

  formatDateTime(dateTime: number): string {
    const date = new Date(dateTime);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  }
}
