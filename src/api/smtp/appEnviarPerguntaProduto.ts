import ApiResponseHandler from '../apiResponseHandler';
import SmtpService from '../../services/smtpService';

export default async (req, res, next) => {
  try {

    const payload = await new SmtpService(req).enviarPerguntaProduto(req.body.comentario, req.body.produtoId, req.currentUser);

    await ApiResponseHandler.success(req, res, payload);
  } catch (error) {
    await ApiResponseHandler.error(req, res, error);
  }
};