import { Component, OnInit, AfterViewInit, Input, Output, EventEmitter } from '@angular/core';

declare var google: any;

@Component({
  selector: 'app-google-map',
  templateUrl: './google-map.component.html',
  styleUrls: ['./google-map.component.scss'],
})
export class GoogleMapsComponent implements OnInit, AfterViewInit {
  @Input() isAdmin: boolean = false;
  @Input() defaultLocation: { lat: any, lng: any } | null = null;
  @Output() placeSelected: EventEmitter<{ lat: number, lng: number, name: string, address: string }> = new EventEmitter();

  // exemplos de chamadas no html
  // <app-google-map [isAdmin]="true" (placeSelected)="handlePlaceSelected($event)" ></app-google-map>
  // <app-google-map [defaultLocation]="{ lat: -23.5505, lng: -46.6333 }"></app-google-map>

  map: any;
  marker: any;
  placePicker: any;

  name: string = '';
  adrees: string = '';

  constructor() { }

  ngOnInit() { }

  ngAfterViewInit() {
    this.initMap();
  }

  initMap() {
    const mapElement = document.getElementById('map') as HTMLElement;
    const center = this.defaultLocation
      ? {
        lat: parseFloat(this.defaultLocation.lat),
        lng: parseFloat(this.defaultLocation.lng)
      }
      : { lat: -23.5505, lng: -46.6333 };

    this.map = new google.maps.Map(mapElement, {
      center: center,
      zoom: 15,
      mapTypeControl: false,
    });

    this.marker = new google.maps.Marker({
      map: this.map,
      position: center,
    });

    if (this.isAdmin) {
      this.initSearch();
    }
  }

  initSearch() {
    this.placePicker = new google.maps.places.Autocomplete(
      document.getElementById('place-picker') as HTMLInputElement
    );

    this.placePicker.addListener('place_changed', () => {
      const place = this.placePicker.getPlace();

      if (!place.geometry) {
        window.alert(`Nenhum detalhe disponível para o lugar: '${place.name}'`);
        return;
      }

      if (place.geometry.viewport) {
        this.map.fitBounds(place.geometry.viewport);
      } else {
        this.map.setCenter(place.geometry.location);
        this.map.setZoom(17);
      }

      this.marker.setPosition(place.geometry.location);

      const infowindow = new google.maps.InfoWindow({
        content: `
          <div>
            <strong>${place.name}</strong><br>
            ${place.formatted_address}
          </div>
        `,
      });
      infowindow.open(this.map, this.marker);


      this.emitCoordinates(place.geometry.location.lat(), place.geometry.location.lng(), place.name, place.formatted_address);
    });

    google.maps.event.addListener(this.map, 'click', (event: any) => {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();

      this.marker.setPosition(event.latLng);

      const geocoder = new google.maps.Geocoder();

      geocoder.geocode({ location: event.latLng }, (results: any, status: any) => {
        if (status === google.maps.GeocoderStatus.OK && results[0]) {
          const address = results[0].formatted_address;
          const name = results[0].address_components.map((component: any) => component.long_name).join(', ');

          this.emitCoordinates(lat, lng, name, address);


        } else {
          window.alert('Não foi possível encontrar o endereço para as coordenadas clicadas.');
        }
      });
    });

  }

  emitCoordinates(lat: number, lng: number, name: string, address: string) {
    this.placeSelected.emit({ lat, lng, name, address });
  }
}
