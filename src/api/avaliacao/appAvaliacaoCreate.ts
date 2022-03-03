import PermissionChecker from '../../services/user/permissionChecker';
import ApiResponseHandler from '../apiResponseHandler';
import Permissions from '../../security/permissions';
import AvaliacaoService from '../../services/avaliacaoService';

export default async (req, res, next) => {
  try {
    const payload = await new AvaliacaoService(req).criarImc(
      req.body.data,
    );

    await ApiResponseHandler.success(req, res, payload);
  } catch (error) {
    await ApiResponseHandler.error(req, res, error);
  }
};
