// src/app/utils/utils.ts
import { ToastController } from '@ionic/angular';
import { AbstractControl, ValidatorFn } from '@angular/forms';


export class Utils {

  // Método estático para validar CPF
  static validateCpf(cpf: string): { [key: string]: boolean } | null {
    cpf = cpf.replace(/\D/g, ''); // Remove caracteres não numéricos

    if (!cpf) return null; // Sem CPF, não faz validação
    const cpfPattern = /^\d{11}$/; // Apenas 11 dígitos
    if (!cpfPattern.test(cpf)) return { invalidCpf: true };

    // Lógica para validação real do CPF
    const sum = cpf.split('').slice(0, 9).reduce((acc: number, num: string, index: number) => {
      return acc + (Number(num) * (10 - index));
    }, 0) * 10 % 11;
    
    const checkDigit1 = sum >= 10 ? 0 : sum;
    const sum2 = cpf.split('').slice(0, 10).reduce((acc: number, num: string, index: number) => {
      return acc + (Number(num) * (11 - index));
    }, 0) * 10 % 11;

    const checkDigit2 = sum2 >= 10 ? 0 : sum2;

    if (checkDigit1 !== Number(cpf[9]) || checkDigit2 !== Number(cpf[10])) {
      return { invalidCpf: true };
    }

    return null;
  }

  // Método para retornar o validador de CPF
  static cpfValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      return Utils.validateCpf(control.value); // Chama a validação de CPF
    };
  }
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
