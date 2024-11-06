import { Component, OnInit } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(private swUpdate: SwUpdate, private toast: ToastrService) {}

  ngOnInit() {
    this.checkForUpdates();
  }

  checkForUpdates() {
    if (this.swUpdate.isEnabled) {
      this.swUpdate.versionUpdates.subscribe(event => {
        if (event.type === 'VERSION_READY') {
          this.toast.info(
            'Há uma nova versão disponível!',
            'Clique para atualizar',
            {
              timeOut: 5000,
              closeButton: true,
              tapToDismiss: false
            }
          ).onTap.subscribe(() => {
            this.swUpdate.activateUpdate().then(() => {
              window.location.reload();
            });
          });
        }
      });
    }
  }
}
