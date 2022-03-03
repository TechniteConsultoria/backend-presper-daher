import PermissionChecker from '../../services/user/permissionChecker';
import ApiResponseHandler from '../apiResponseHandler';
import Permissions from '../../security/permissions';
import QuestionarioClienteRespostaService from '../../services/questionarioClienteRespostaService';

export default async (req, res, next) => {
  try {
    const payload = await new QuestionarioClienteRespostaService(
      req,
    ).findAndCountAllOpen(req.query);

    await ApiResponseHandler.success(req, res, payload);
  } catch (error) {
    await ApiResponseHandler.error(req, res, error);
  }
};
