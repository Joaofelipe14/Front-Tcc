import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-inicio-colaborador',
  templateUrl: './inicio-colaborador.component.html',
  styleUrls: ['./inicio-colaborador.component.scss'],
})
export class InicioColaboradorComponent  implements OnInit {

  vendas: any[] = [];

  constructor() { }



  ngOnInit() {
    // Mock data for sales records
    this.vendas = [
      { area: 'Zona Norte', dateTime: '20/08/2024 14:30', code: 'ABC123' },
      { area: 'Zona Sul', dateTime: '21/08/2024 09:00', code: 'XYZ456' },
      { area: 'Zona Leste', dateTime: '22/08/2024 16:45', code: 'DEF789' },
      { area: 'Zona Leste', dateTime: '22/08/2024 16:45', code: 'DEF789' },

      // Add more mock records if needed
    ];
  }

}
