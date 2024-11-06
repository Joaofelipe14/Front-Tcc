import { Component, OnInit } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { ToastrService } from 'ngx-toastr'; // Supondo que você use ngx-toastr para mostrar toasts

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
      // Monitorando as atualizações do Service Worker
      this.swUpdate.versionUpdates.subscribe(event => {
        if (event.type === 'VERSION_READY') {
          // Uma nova versão está pronta para ser ativada
          this.toast.info(
            'Há uma nova versão disponível!',
            'Clique para atualizar',
            {
              timeOut: 5000,
              closeButton: true,
              tapToDismiss: false
            }
          ).onTap.subscribe(() => {
            // Forçar a ativação da atualização
            this.swUpdate.activateUpdate().then(() => {
              // Após ativar, recarregar a página
              window.location.reload();
            });
          });
        }
      });
    }
  }
}
