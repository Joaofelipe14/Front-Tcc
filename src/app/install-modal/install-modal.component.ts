import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-install-modal',
  templateUrl: './install-modal.component.html',
  styleUrls: ['./install-modal.component.scss'],
})
export class InstallModalComponent {
  @Output() installConfirmed = new EventEmitter<void>();
  @Output() installCanceled = new EventEmitter<void>();

  constructor() {}

  onInstallClick() {
    this.installConfirmed.emit();
  }

  onCancelClick() {
    this.installCanceled.emit();
  }
}
