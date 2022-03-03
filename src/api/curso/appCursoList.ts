/* import ApiResponseHandler from '../apiResponseHandler';
import CursoService from '../../services/cursoService';

export default async (req, res, next) => {
  try {

    const payload = await new CursoService(
      req,
    ).appFindAndCountAll(req.query);

    await ApiResponseHandler.success(req, res, payload);
  } catch (error) {
    await ApiResponseHandler.error(req, res, error);
  }
};
 */