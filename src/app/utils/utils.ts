// src/app/utils/utils.ts
import { ToastController } from '@ionic/angular';

export class Utils {

  /**
   * Formata um CPF com a máscara `000.000.000-00`.
   * @param value O valor do CPF, que pode conter caracteres não numéricos.
   * @returns O CPF formatado.
   */
  static formatCpf(value: string): string {
    if (!value) {
      return '';
    }
    const onlyNumbers = value.replace(/\D/g, '');
    return onlyNumbers.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3-$4');
  }

  /**
   * Remove a máscara e retorna apenas os números do CPF.
   * @param value O valor do CPF formatado.
   * @returns O CPF somente com números.
   */
  static unformatCpf(value: string): string {
    return value.replace(/\D/g, '');
  }

  /**
   * Exibe uma mensagem de toast.
   * @param message A mensagem a ser exibida.
   * @param toastController O controlador de toast do Ionic.
   * @param duration Duração do toast em milissegundos.
   * @param color Cor do toast.
   */
  static async showToast(
    message: string,
    toastController: ToastController,
    classe: string,
    icon: string,
    duration: number = 3000,
  ): Promise<void> {
    const toast = await toastController.create({
      message: message,
      duration: duration,
      cssClass: classe,
      icon: icon,
      position: 'bottom',
      buttons: [
        {
          side: 'end',
          text: 'X',
          role: 'cancel',
          handler: () => {
          }
        }
      ]
    });
    toast.present();
  }

  static async showErro(msg: string, toastController: ToastController,) {
    const toast = await toastController.create({
      message: msg,
      icon: 'alert-circle-outline',
      duration: 2000,
      color: 'danger', 
      buttons: [
        {
          side: 'end',
          text: 'X',
          role: 'cancel',
          handler: () => {
          }
        }
      ]
    });
    toast.present();
  }

  static async showSucesso(msg: string, toastController: ToastController,) {
    const toast = await toastController.create({
      message: msg,
      icon: 'checkmark-circle-outline',
      duration: 2000,
      color: 'success', 
      buttons: [
        {
          side: 'end',
          text: 'X',
          role: 'cancel',
          handler: () => {
          }
        }
      ]
    });
    toast.present();
  }


  static applyPhoneMask(contato: string): string {
    if (!contato) {
      return '';
    }
    let value = contato.replace(/\D/g, '');

    if (value.length > 0) {
      value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
    }
    if (value.length > 10) {
      value = value.replace(/(\d{5})(\d{4})$/, '$1-$2');
    }

    return value
   
  }
}
