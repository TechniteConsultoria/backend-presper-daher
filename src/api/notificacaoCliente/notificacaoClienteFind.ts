import PermissionChecker from '../../services/user/permissionChecker'
import ApiResponseHandler from '../apiResponseHandler'
import Permissions from '../../security/permissions'
import NotificacaoClienteService from '../../services/notificacaoClienteService'

export default async (req, res, next) => {
  try {
    const payload = await new NotificacaoClienteService(
      req,
    ).findById(req.params)

    await ApiResponseHandler.success(req, res, payload)
  } catch (error) {
    await ApiResponseHandler.error(req, res, error)
  }
}
