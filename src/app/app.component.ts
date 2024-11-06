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

  constructor(private swUpdate: SwUpdate, private toastr: ToastrService) {}

  ngOnInit(): void {
    if (this.swUpdate.isEnabled) {
      // Verifica a versão do app toda vez que o usuário abrir o aplicativo
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
    
    if (currentAppVersion !== storedVersion) {
      console.log('Nova versão detectada!');
      
      // Usando Toastr para informar sobre a nova versão, mas esperando o clique do usuário
      const toast = this.toastr.info('Uma nova versão está disponível. O app será atualizado. Clique para atualizar.', 'Nova versão', {
        timeOut: 0, // Não fechar automaticamente
        progressBar: true, // Barra de progresso
        closeButton: true, // Mostrar botão de fechar
        disableTimeOut: true // Não desabilitar o clique
      });

      // Usando o evento de clique no Toast para atualizar
      toast.onTap.subscribe(() => {
        // Atualizando a versão no localStorage e recarregando a página
        localStorage.setItem('appVersion', currentAppVersion);
        window.location.reload(); // Recarregando a página após o clique
      });
    } else {
      console.log('Versão já está atual.');
    }
  }
}
