import PermissionChecker from '../../services/user/permissionChecker';
import ApiResponseHandler from '../apiResponseHandler';
import Permissions from '../../security/permissions';
import CarrinhoProdutoService from '../../services/carrinhoProdutoService';

export default async (req, res, next) => {
  try {
    // new PermissionChecker(req).validateHas(
    //   Permissions.values.carrinhoProdutoDestroy,
    // );

    // o empresaId não é usado neste momento, deixado para acaso conflito futuro!
    await new CarrinhoProdutoService(req).destroyByUser(
      req.params.id,
    );

    const payload = true;

    await ApiResponseHandler.success(req, res, payload);
  } catch (error) {
    await ApiResponseHandler.error(req, res, error);
  }
};
