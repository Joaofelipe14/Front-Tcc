import { Component, OnInit } from '@angular/core';
import { LocalizacaoService } from '../services/localizacao.service';

declare var google: any;

@Component({
  selector: 'app-resultados-map',
  templateUrl: './resultadosmap.component.html',
  styleUrls: ['./resultadosmap.component.scss'],
})
export class ResultadosmapComponent implements OnInit {
  places: any[] = [];
  map: any;
  markers: any[] = [];
  filteredPlaces: any[] = [];
  isLoading = false;
  filterType: string = 'todos';

  constructor(private localizacao: LocalizacaoService) { }

  ngOnInit(): void {
    this.loadResultadosMapa();
  }

  loadResultadosMapa(): void {
    this.isLoading = true;
    this.localizacao.getResultadosMapa().subscribe(
      (response) => {
        if (response.status) {
          this.places = this.aggregatePlaces(response.dados);
          this.filteredPlaces = this.places;
        }
        
        this.initMap();
        this.isLoading = false;
      },
      (error) => {
        this.isLoading = false;
        console.error('Erro ao carregar registros de vendas', error);
      }
    );
  }

  initMap() {
    const mapElement = document.getElementById('map') as HTMLElement;
    const center = { lat: -2.88405, lng: -41.9167 };

    this.map = new google.maps.Map(mapElement, {
      center: center,
      zoom: 12,
      mapTypeControl: false,
    });

    this.addMarkers(this.filteredPlaces);
  }

  aggregatePlaces(data: any[]): any[] {
    const groupedPlaces: any[] = [];
    data.forEach(place => {
      const existingPlace = groupedPlaces.find(p => p.lat === place.lat && p.lng === place.lng && p.type === place.type);
      
      if (existingPlace) {
        existingPlace.dados.push(place);
      } else {
        groupedPlaces.push({
          lat: place.lat,
          lng: place.lng,
          type: place.type,
          dados: [place]
        });
      }
    });

    return groupedPlaces;
  }

  addMarkers(places: any[]) {
    this.markers.forEach(marker => {
      marker.setMap(null);
    });
    this.markers = [];

    places.forEach((place, index) => {
      const iconUrl = place.type === 'pesca'
        ? 'assets/icon_logo.png'
        : 'https://img.icons8.com/ios/50/000000/price-tag.png';

      let latOffset = (Math.random() - 0.5) * 0.001;
      let lngOffset = (Math.random() - 0.5) * 0.001;

      const marker = new google.maps.Marker({
        position: { lat: place.lat + latOffset, lng: place.lng + lngOffset },
        map: this.map,
        title: 'Clique para ver detalhes',
        icon: {
          url: iconUrl,
          scaledSize: new google.maps.Size(32, 32),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(16, 32),
        },
      });

      const infowindow = new google.maps.InfoWindow({
        content: this.createInfoWindowContent(place),
      });

      marker.addListener('click', () => {
        infowindow.open(this.map, marker);
      });

      this.markers.push(marker);
    });
  }

  createInfoWindowContent(place: any): string {
    let content = `
      <div style="color:dimgray">
        <strong>Local: </strong> ${place.type === 'pesca' ? 'Pesca' : 'Venda'}<br>
        <strong>Localização: </strong> Lat: ${place.lat}, Lng: ${place.lng}<br>
        <strong>Informações:</strong>
        <ul>
    `;

    place.dados.forEach((d: any) => {
      content += `<li>${d.pescado ? 'Pescado: ' + d.pescado : 'Sem pescado'} - Quantidade: ${d.quantidade}</li>`;
    });

    content += '</ul></div>';
    return content;
  }

  filterPlaces(type: string) {
    this.filterType = type;

    if (type === 'todos') {
      this.filteredPlaces = this.places;
    } else {
      this.filteredPlaces = this.places.filter(place => place.type === type);
    }

    this.addMarkers(this.filteredPlaces);
  }
}
