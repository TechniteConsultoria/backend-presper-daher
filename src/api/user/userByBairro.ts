import PermissionChecker from '../../services/user/permissionChecker';
import ApiResponseHandler from '../apiResponseHandler';
import Permissions from '../../security/permissions';
import UserService from '../../services/userService';

export default async (req, res) => {
  try {
    
    const payload = await new UserService(req).findByBairro(
      req.params.bairro,
    );

    await ApiResponseHandler.success(req, res, payload);
  } catch (error) {
    await ApiResponseHandler.error(req, res, error);
  }
};
