import ApiResponseHandler from '../apiResponseHandler';
import QuestionarioPerguntaService from '../../services/questionarioPerguntaService';

export default async (req, res, next) => {
  try {
    const payload = await new QuestionarioPerguntaService(
      req,
    ).findAndCountAllOpen(req.query);

    await ApiResponseHandler.success(req, res, payload);
  } catch (error) {
    await ApiResponseHandler.error(req, res, error);
  }
};
