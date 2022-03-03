import ApiResponseHandler from '../apiResponseHandler';
import ClienteService from '../../services/clienteService';

export default async (req, res, next) => {
  try {

    const payload = await new ClienteService(req).appUpdate(
      req.body.id,
      req.body.data,
    );

    await ApiResponseHandler.success(req, res, payload);
  } catch (error) {
    await ApiResponseHandler.error(req, res, error);
  }
};
