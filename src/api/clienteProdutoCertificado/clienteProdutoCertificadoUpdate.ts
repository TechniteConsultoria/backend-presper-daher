import PermissionChecker from '../../services/user/permissionChecker';
import ApiResponseHandler from '../apiResponseHandler';
import Permissions from '../../security/permissions';
import clienteProdutoCertificadoService from '../../services/clienteProdutoCertificadoService';

export default async (req, res, next) => {
  try {/*
    new PermissionChecker(req).validateHas(
      Permissions.values.clienteProdutoCertificadoEdit,
    );*/

    const payload = await new clienteProdutoCertificadoService(req).update(
      req.params.id,
      req.body.data,
    );

    await ApiResponseHandler.success(req, res, payload);
  } catch (error) {
    await ApiResponseHandler.error(req, res, error);
  }
};