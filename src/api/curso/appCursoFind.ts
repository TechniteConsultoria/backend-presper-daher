/* import ApiResponseHandler from '../apiResponseHandler';
import CursoService from '../../services/cursoService';

export default async (req, res, next) => {
  try {
    
    const payload = await new CursoService(req).appFindById(
      req.params.curso,
    );

    await ApiResponseHandler.success(req, res, payload);
  } catch (error) {
    await ApiResponseHandler.error(req, res, error);
  }
};
 */