import PermissionChecker from '../../services/user/permissionChecker';
import ApiResponseHandler from '../apiResponseHandler';
import Permissions from '../../security/permissions';
import clienteProdutoCertificadoervice from '../../services/clienteProdutoCertificadoService';

export default async (req, res, next) => {
  try {
    /*new PermissionChecker(req).validateHas(
      Permissions.values.clienteProdutoCertificadoCreate,
    );*/
    console.log("req.body")
    console.log(req.body)

    const payload = await new clienteProdutoCertificadoervice(req).create(
      req.body.data,
    );

    await ApiResponseHandler.success(req, res, payload);
  } catch (error) {
    await ApiResponseHandler.error(req, res, error);
  }
};
