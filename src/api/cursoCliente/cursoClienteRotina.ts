import PermissionChecker from '../../services/user/permissionChecker';
import ApiResponseHandler from '../apiResponseHandler';
import Permissions from '../../security/permissions';
import CursoClienteService from '../../services/cursoClienteService';

export default async (req, res, next) => {
  try {

    const payload = await new CursoClienteService(
      req,
    ).rotinaBoleto();

    await ApiResponseHandler.success(req, res, payload);
  } catch (error) {
    await ApiResponseHandler.error(req, res, error);
  }
};
