import { i18n, i18nExists } from '../i18n';

/**
 * Error with code 400
 */
export default class Error400 extends Error {
  code: Number;

  constructor(language?, messageCode?, ...args) {
    let message;

    if (messageCode == 1){
      message = 'Valores diferentes em Senha e Confirmação de Senha'
    }

    if (messageCode == 2){
      message = 'Já existe um usuário cadastrado com esse email'
    }

    if (messageCode && i18nExists(language, messageCode) || messageCode == 'Já existe um usuário cadastrado com esse email') {
      message = i18n(language, messageCode, ...args);
    }

    /* if (messageCode && i18nExists(language, messageCode)) {
      message = i18n(language, messageCode, ...args);
    } */

    message =
      message ||
      i18n(language, 'errors.validation.message');

    super(message);
    this.code = 400;
  }
}
