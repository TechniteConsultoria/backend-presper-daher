import PermissionChecker from '../../services/user/permissionChecker';
import ApiResponseHandler from '../apiResponseHandler';
import Permissions from '../../security/permissions';
import ProgramaAtividadeItemService from '../../services/programaAtividadeItemService';

export default async (req, res, next) => {
  try {
    
    const payload = await new ProgramaAtividadeItemService(
      req,
    ).listAtividades(req);
    

    await ApiResponseHandler.success(req, res, payload);
  } catch (error) {
    await ApiResponseHandler.error(req, res, error);
  }
};
