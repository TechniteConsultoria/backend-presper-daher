import PermissionChecker from '../../services/user/permissionChecker';
import ApiResponseHandler from '../apiResponseHandler';
import Permissions from '../../security/permissions';
import ProdutoModuloService from '../../services/produtoModuloService';
import EmpresaService from '../../services/empresaService';

export default async (req, res, next) => {
  try {
    new PermissionChecker(req).validateHas(
      Permissions.values.produtoCreate,
    );

    if (req.currentUser.tenants[0].roles == '["empresa"]') {
    }

    const payload = await new ProdutoModuloService(req).create(
      req.body.data,
    );

    await ApiResponseHandler.success(req, res, payload);
  } catch (error) {
    await ApiResponseHandler.error(req, res, error);
  }
};
