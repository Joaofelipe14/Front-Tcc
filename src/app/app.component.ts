import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
  deferredPrompt: any;
  isVisible: boolean = false;
  cancelDate: string | null = null;

  ngOnInit() {
    /*
      Verifica se há uma data de cancelamento salva no localStorage.
      Se o pop-up foi cancelado no mesmo dia, não será exibido novamente.
    */
    this.cancelDate = localStorage.getItem('installCancelDate');

    if (this.cancelDate) {
      const cancelDate = this.cancelDate;
      const today = new Date().toISOString().split('T')[0];

      if (cancelDate === today) {
        console.log('Pop-up de instalação não será mostrado hoje');
        return;
      }
    }

    /*
      Verifica se o aplicativo está no modo standalone (instalado).
      Se estiver, o pop-up não será exibido.
    */
    if (window.matchMedia('(display-mode: standalone)').matches) {
      console.log('App já está instalado!');
      return;
    }

    /*
      Captura o evento beforeinstallprompt, que é disparado quando o navegador
      sugere a instalação do PWA. O pop-up será exibido quando esse evento ocorrer.
    */
    window.addEventListener('beforeinstallprompt', (e: Event) => {
      e.preventDefault();
      this.deferredPrompt = e;
      this.isVisible = true;
    });
  }

  onInstallConfirmed() {
    console.log('Instalação confirmada!');
    this.addToHomeScreen();
  }

  onInstallCancelled() {
    console.log('Instalação cancelada');
    this.isVisible = false;

    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem('installCancelDate', today);

    
  }

  addToHomeScreen() {
    if (this.deferredPrompt) {
      this.deferredPrompt.prompt();
      this.deferredPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('Usuário aceitou adicionar à tela inicial');
        } else {
          console.log('Usuário recusou adicionar à tela inicial');
        }
        this.deferredPrompt = null;
        this.isVisible = false;
      });
    }
  }
}
