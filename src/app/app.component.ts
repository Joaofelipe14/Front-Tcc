import { Component, OnInit } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { ToastrService } from 'ngx-toastr'; // Importando o Toastr

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(private swUpdate: SwUpdate, private toastr: ToastrService) { }

  ngOnInit(): void {
    if (this.swUpdate.isEnabled && environment.production) {
      this.checkVersion();
    } else {
      console.log('Service Worker não está habilitado!');
    }
  }

  checkVersion(): void {
    console.log('Verificando por novas atualizações...');
    const currentAppVersion = environment.appVersion;
    console.log('Versão atual: ' + currentAppVersion);
    const storedVersion = localStorage.getItem('appVersion');
  
    if (storedVersion === null) {
      localStorage.setItem('appVersion', currentAppVersion);
      return;
    }
      if (currentAppVersion !== storedVersion) {
      console.log('Nova versão detectada!');
  
      const toast = this.toastr.info('Uma nova versão está disponível. Clique para atualizar.', 'Nova versão', {
        timeOut: 0, 
        progressBar: true,
        closeButton: true,
        disableTimeOut: true
      });
  
      toast.onTap.subscribe(() => {
        localStorage.setItem('appVersion', currentAppVersion);
        window.location.reload();
      });
    } else {
      console.log('Versão já está atual.');
    }
  }
  
}
