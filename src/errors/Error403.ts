import { i18n, i18nExists } from '../i18n';

/**
 * Error with code 403.
 */
export default class Error403 extends Error {
  code: Number;

  constructor(language?, messageCode?) {
    let message;

    if (messageCode == 1){
      message = 'Usuário ou senha incorretos';
    }

    if (messageCode == 2){
      message = 'Email não verificado';
    }

    if (messageCode == 3){
      message = 'Não é permitido mais de um agendamento para o mesmo nutricionista!';
    }

    if (messageCode && i18nExists(language, messageCode)) {
      message = i18n(language, messageCode);
    }

    message =
      message || i18n(language, 'errors.forbidden.message');

    super(message);
    this.code = 403;
  }
}
