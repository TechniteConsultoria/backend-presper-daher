import ApiResponseHandler from '../apiResponseHandler';
import PerguntaService from '../../services/perguntaService';

export default async (req, res, next) => {
  try {

    const payload = await new PerguntaService(req).appFindById(
      req.params.pergunta,
    );

    await ApiResponseHandler.success(req, res, payload);
  } catch (error) {
    await ApiResponseHandler.error(req, res, error);
  }
};
