import PermissionChecker from '../../services/user/permissionChecker';
import ApiResponseHandler from '../apiResponseHandler';
import Permissions from '../../security/permissions';
import ProdutoModuloService from '../../services/produtoModuloService';


export default async (req, res, next) => {
  try {
    // new PermissionChecker(req).validateHas(
    //   Permissions.values.produtoRead,
    // );

    const payload = await new ProdutoModuloService(req).findById(
      req.params.id,
    );

    await ApiResponseHandler.success(req, res, payload);
  } catch (error) {
    await ApiResponseHandler.error(req, res, error);
  }
};
