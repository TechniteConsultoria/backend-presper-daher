import ApiResponseHandler from '../apiResponseHandler';
import QuestionarioClienteService from '../../services/questionarioClienteService';

export default async (req, res, next) => {
  try {

    const payload = await new QuestionarioClienteService(
      req,
    ).findAndCountAllOpen(req.query);

    await ApiResponseHandler.success(req, res, payload);
  } catch (error) {
    await ApiResponseHandler.error(req, res, error);
  }
};
