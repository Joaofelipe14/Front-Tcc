import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
  deferredPrompt: any;
  showInstallModal: boolean = false;

  ngOnInit() {
    // Verifica se o app está sendo executado no modo standalone
    if (window.matchMedia('(display-mode: standalone)').matches) {
      console.log('App já está instalado!');
      return; // Se já estiver instalado, não mostra o modal
    }

    // Captura o evento beforeinstallprompt
    window.addEventListener('beforeinstallprompt', (e: Event) => {
      e.preventDefault();  // Impede que o prompt seja mostrado automaticamente
      this.deferredPrompt = e;  // Armazena o evento para ser usado mais tarde
      this.showInstallModal = true;  // Exibe o modal para adicionar à tela inicial
      console.log('Prompt de instalação armazenado, showInstallModal agora é: true');
    });
  }

  // Função para exibir o prompt de instalação
  addToHomeScreen() {
    if (this.deferredPrompt) {
      // Mostra o prompt de instalação
      this.deferredPrompt.prompt();

      // Aguardar a escolha do usuário
      this.deferredPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('Usuário aceitou adicionar à tela inicial');
        } else {
          console.log('Usuário recusou adicionar à tela inicial');
        }
        this.deferredPrompt = null;  // Limpa o evento após a escolha
        this.showInstallModal = false;  // Fecha o modal
      });
    }
  }

  // Fechar o modal sem fazer nada
  dismissModal() {
    this.showInstallModal = false;
  }
}
