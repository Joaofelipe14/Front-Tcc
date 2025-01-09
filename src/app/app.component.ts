import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { InstallModalComponent } from './install-modal/install-modal.component'; // Caminho do componente de modal

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
  deferredPrompt: any;
  showInstallPrompt: boolean = false;

  constructor(private modalController: ModalController) {}

  ngOnInit() {
    // Verifica se o app está sendo executado no modo standalone
    if (window.matchMedia('(display-mode: standalone)').matches) {
      console.log('App já está instalado!');
      return; // Se já estiver instalado, não mostra o botão
    }

    // Captura o evento beforeinstallprompt
    window.addEventListener('beforeinstallprompt', (e: Event) => {
      e.preventDefault();  // Impede que o prompt seja mostrado automaticamente
      this.deferredPrompt = e;  // Armazena o evento para ser usado mais tarde
      this.showInstallPrompt = true;  // Exibe o botão para adicionar à tela inicial

      // Exibe o modal
      this.showInstallModal();
    });
  }

  async showInstallModal() {
    const modal = await this.modalController.create({
      component: InstallModalComponent
    });

    // Quando o usuário clicar em "Sim, Adicionar!"
    modal.onDidDismiss().then((result) => {
      if (result.data === 'installConfirmed') {
        this.addToHomeScreen();
      } else {
        console.log('Instalação cancelada');
      }
    });

    await modal.present();
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
