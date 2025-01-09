import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';  // Importando ModalController

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
  deferredPrompt: any;
  modal: any;

  constructor(private modalController: ModalController) {}

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
      this.presentInstallModal(); // Exibe o modal quando o evento ocorrer
    });
  }

  // Função para exibir o modal
  async presentInstallModal() {
    const modal = await this.modalController.create({
      component: null,  // Aqui não usaremos um componente separado
      cssClass: 'install-modal',  // Classe CSS para estilizar o modal
      backdropDismiss: false,  // Impede o fechamento do modal clicando fora
      componentProps: {
        deferredPrompt: this.deferredPrompt,
        onInstall: this.addToHomeScreen.bind(this)
      }
    });

    modal.componentProps = {
      ...modal.componentProps,
      header: 'Adicionar à Tela Inicial',
      message: 'Gostaria de adicionar o aplicativo à sua tela inicial para uma melhor experiência?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            this.dismissModal();  // Fecha o modal se o usuário clicar em "Cancelar"
          }
        },
        {
          text: 'Adicionar',
          handler: () => {
            this.addToHomeScreen();  // Adiciona o app à tela inicial
            this.dismissModal();  // Fecha o modal
          }
        }
      ]
    };

    await modal.present();  // Exibe o modal
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
      });
    }
  }

  // Função para fechar o modal
  dismissModal() {
    if (this.modal) {
      this.modal.dismiss();
    }
  }
}
