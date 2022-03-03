import PermissionChecker from '../../services/user/permissionChecker';
import ApiResponseHandler from '../apiResponseHandler';
import Permissions from '../../security/permissions';
import QuestionarioClienteService from '../../services/questionarioClienteService';

export default async (req, res, next) => {
  try {
    const payload = await new QuestionarioClienteService(req).createOpen(
      req.body.data,
    );

    await ApiResponseHandler.success(req, res, payload);
  } catch (error) {
    await ApiResponseHandler.error(req, res, error);
  }
};
