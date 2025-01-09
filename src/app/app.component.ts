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
    console.log('ngOnInit chamado'); // Log de quando o componente é inicializado
    
    // Verifica se o app está sendo executado no modo standalone
    if (window.matchMedia('(display-mode: standalone)').matches) {
      console.log('App já está instalado!');
      return; // Se já estiver instalado, não mostra o botão
    }

    // Captura o evento beforeinstallprompt se o PWA não estiver instalado
    window.addEventListener('beforeinstallprompt', (e: Event) => {
      console.log('beforeinstallprompt disparado'); // Log do evento de instalação

      e.preventDefault();  // Impede que o prompt seja mostrado automaticamente
      this.deferredPrompt = e;  // Armazena o evento para ser usado mais tarde
      this.showInstallPrompt = true;  // Exibe o botão para adicionar à tela inicial

      console.log('Prompt de instalação armazenado, showInstallPrompt agora é:', this.showInstallPrompt); // Log para verificar o estado da flag
    });
  }

  // Função para exibir o prompt de instalação
  addToHomeScreen() {
    console.log('addToHomeScreen chamado'); // Log de quando a função é chamada

    if (this.deferredPrompt) {
      console.log('Prompt de instalação encontrado, exibindo o prompt...');
      this.deferredPrompt.prompt();  // Exibe o prompt para o usuário
      
      this.deferredPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('Usuário aceitou adicionar à tela inicial');
        } else {
          console.log('Usuário recusou adicionar à tela inicial');
        }
        this.deferredPrompt = null;  // Limpa o evento após a escolha
        this.showInstallPrompt = false;  // Oculta o botão
        console.log('Prompt limpo, showInstallPrompt agora é:', this.showInstallPrompt); // Log para verificar o estado da flag
      });
    } else {
      console.log('Nenhum prompt de instalação disponível');
    }
  }
}
