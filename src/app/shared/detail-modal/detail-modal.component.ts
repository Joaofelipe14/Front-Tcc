import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Utils } from 'src/app/utils/utils';

@Component({
  selector: 'app-detail-modal',
  templateUrl: './detail-modal.component.html',
  styleUrls: ['./detail-modal.component.scss'],
})
export class DetailModalComponent {
  @Input() registro: any;

  Utils = Utils
  constructor(private modalController: ModalController) {}

  
  dismiss() {
    this.modalController.dismiss();
    this.registro = null
  }

  formatDateTime(dateTime: number): string {
    const date = new Date(dateTime);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  }
}
