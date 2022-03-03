import PermissionChecker from '../../services/user/permissionChecker';
import ApiResponseHandler from '../apiResponseHandler';
import Permissions from '../../security/permissions';
import ClienteService from '../../services/clienteService';
import SmtpService from '../../services/smtpService';

export default async (req, res, next) => {
  try {
    new PermissionChecker(req).validateHas(
      Permissions.values.clienteCreate,
    );

    const payload = await new ClienteService(req).create(
      req.body.data,
    );

    const mail = await new SmtpService(req).enviarVerificacaoBackOffice(payload.email);

    await ApiResponseHandler.success(req, res, mail);
  } catch (error) {
    await ApiResponseHandler.error(req, res, error);
  }
};
