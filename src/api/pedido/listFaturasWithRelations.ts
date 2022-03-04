import PermissionChecker from '../../services/user/permissionChecker';
import ApiResponseHandler from '../apiResponseHandler';
import Permissions from '../../security/permissions';
import PedidoService from '../../services/pedidoService';

export default async (req, res, next) => {
  try {
    new PermissionChecker(req).validateHas(
      Permissions.values.pedidoRead,
    );
    console.log("---------------------------------------------------------------------------------------------------------------------------------")
    console.log("req.query")
    console.log(req.query)
    console.log("---------------------------------------------------------------------------------------------------------------------------------")

    
      const payload = await new PedidoService(
        req,
      ).listFaturas(req.query);
      
        await ApiResponseHandler.success(req, res, payload);
      } catch (error) {
        await ApiResponseHandler.error(req, res, error);
      }
    }