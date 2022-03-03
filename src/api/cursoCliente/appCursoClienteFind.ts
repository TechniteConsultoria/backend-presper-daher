import ApiResponseHandler from '../apiResponseHandler';
import CursoClienteService from '../../services/cursoClienteService';

export default async (req, res, next) => {
  try {

    const payload = await new CursoClienteService(req).appFindById(
      req.params.curso,
    );

    await ApiResponseHandler.success(req, res, payload);
  } catch (error) {
    await ApiResponseHandler.error(req, res, error);
  }
};
