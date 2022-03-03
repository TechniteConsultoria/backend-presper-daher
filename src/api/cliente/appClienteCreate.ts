import ApiResponseHandler from '../apiResponseHandler';
import ClienteService from '../../services/clienteService';
import SmtpService from '../../services/smtpService';

export default async (req, res, next) => {
  try {

    const cliente = await new ClienteService(req).createExterno(
      req.body.data,
    );

    const mail = await new SmtpService(req).enviarVerificacao(cliente.email)

    await ApiResponseHandler.success(req, res, mail);
  } catch (error) {
    await ApiResponseHandler.error(req, res, error);
  }
};
