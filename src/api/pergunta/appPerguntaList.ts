import ApiResponseHandler from '../apiResponseHandler';
import PerguntaService from '../../services/perguntaService';

export default async (req, res, next) => {
  try {


    const payload = await new PerguntaService(
      req,
    ).appFindAndCountAll(req.params.avaliacao, req.query );

    await ApiResponseHandler.success(req, res, payload);
  } catch (error) {
    await ApiResponseHandler.error(req, res, error);
  }
};
