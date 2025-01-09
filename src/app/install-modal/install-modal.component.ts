import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-install-modal',
  templateUrl: './install-modal.component.html',
  styleUrls: ['./install-modal.component.scss'],
})
export class InstallModalComponent {
  @Output() installConfirmed = new EventEmitter<void>();
  @Output() installCancelled = new EventEmitter<void>();

  constructor() {}

  onInstallClick() {
    this.installConfirmed.emit();
  }

  cancelar() {
    console.log('canceladno')
    this.installCancelled.emit();
  }
}
