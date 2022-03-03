import ApiResponseHandler from '../apiResponseHandler';
import CursoModuloService from '../../services/cursoModuloService';

export default async (req, res, next) => {
  try {

    const payload = await new CursoModuloService(    
      req,
    ).appFindAndCountAll(req.params.curso, req.query);

    await ApiResponseHandler.success(req, res, payload);
  } catch (error) {
    await ApiResponseHandler.error(req, res, error);
  }
};
