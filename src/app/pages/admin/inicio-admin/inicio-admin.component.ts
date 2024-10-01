import { Component, OnInit } from '@angular/core';
import { CadastroPescaService } from 'src/app/services/cadastro-pesca.service';
import { CadastroVendaService } from 'src/app/services/cadastro-venda.service';

@Component({
  selector: 'app-inicio-admin',
  templateUrl: './inicio-admin.component.html',
  styleUrls: ['./inicio-admin.component.scss'],
})
export class InicioAdminComponent implements OnInit {

  registros: any[] = []; // Array para armazenar pescas e vendas combinados


  constructor(
    private cadastroPescaService: CadastroPescaService,
    private cadastroVendaService: CadastroVendaService) { }


  ngOnInit() {
    this.loadPescaAll();
    this.loadVendasAll();

  }

  loadPescaAll(): void {
    this.cadastroPescaService.getRegistrosAll().subscribe(
      (response) => {
        if (response.status) {
          console.log(response)
          const pescas = response.dados.registros.map((registro: {
            user: any; data_com_hora: string; local: any; codigo: any;
          }) => ({
            dateTime: new Date(registro.data_com_hora).getTime(),
            local: registro.local,
            codigo: registro.codigo,
            type: 'pesca',
            usuario: registro.user.name
          }));
          console.log(pescas)

          this.registros = [...this.registros, ...pescas];
          this.sortRegistros();
        }
      },
      (error) => {
        console.error('Erro ao carregar registros de pesca', error);
      }
    );
  }

  loadVendasAll(): void {
    this.cadastroVendaService.getRegistrosAll().subscribe(
      (response) => {
        if (response.status) {
          const vendas = response.dados.registros.map((registro: {
            created_at: string; ponto_venda: any; quantidade: any; valor: any, user: any;}) => ({
            dateTime: new Date(registro.created_at).getTime(),
            ponto_venda: registro.ponto_venda,
            quantidade: registro.quantidade,
            valor: registro.valor,
            type: 'venda',
            usuario: registro.user.name

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

    console.log(this.registros)
  }

  formatDateTime(dateTime: number): string {
    const date = new Date(dateTime);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  }
}
