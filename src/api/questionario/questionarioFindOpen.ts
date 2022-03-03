import ApiResponseHandler from '../apiResponseHandler';
import QuestionarioService from '../../services/questionarioService';

export default async (req, res, next) => {
  try {
    const payload = await new QuestionarioService(req).findByIdOpen(
      req.params.id,
    );

    await ApiResponseHandler.success(req, res, payload);
  } catch (error) {
    await ApiResponseHandler.error(req, res, error);
  }
};
