import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
  deferredPrompt: any;
  showInstallPrompt: boolean = false;

  ngOnInit() {
    // Verifica se o app está sendo executado no modo standalone
    if (window.matchMedia('(display-mode: standalone)').matches) {
      console.log('App já está instalado!');
      return; // Se já estiver instalado, não mostra o botão
    }

    // Captura o evento beforeinstallprompt se o PWA não estiver instalado
    window.addEventListener('beforeinstallprompt', (e: Event) => {
      e.preventDefault();  // Impede que o prompt seja mostrado automaticamente
      this.deferredPrompt = e;  // Armazena o evento para ser usado mais tarde
      this.showInstallPrompt = true;  // Exibe o botão para adicionar à tela inicial

      if(window.confirm('instala ai moço')){
        this.addToHomeScreen()
      }
    });
  }

  // Função para exibir o prompt de instalação
  addToHomeScreen() {
    if (this.deferredPrompt) {
      this.deferredPrompt.prompt();  // Exibe o prompt para o usuário
      this.deferredPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('Usuário aceitou adicionar à tela inicial');
        } else {
          console.log('Usuário recusou adicionar à tela inicial');
        }
        this.deferredPrompt = null;  // Limpa o evento após a escolha
        this.showInstallPrompt = false;  // Oculta o botão
      });
    }
  }
}
