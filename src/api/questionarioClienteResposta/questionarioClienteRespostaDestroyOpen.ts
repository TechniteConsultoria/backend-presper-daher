import PermissionChecker from '../../services/user/permissionChecker';
import ApiResponseHandler from '../apiResponseHandler';
import Permissions from '../../security/permissions';
import QuestionarioClienteRespostaService from '../../services/questionarioClienteRespostaService';

export default async (req, res, next) => {
  try {
    await new QuestionarioClienteRespostaService(req).destroyAllOpen(
      req.query.ids,
    );

    const payload = true;

    await ApiResponseHandler.success(req, res, payload);
  } catch (error) {
    await ApiResponseHandler.error(req, res, error);
  }
};
