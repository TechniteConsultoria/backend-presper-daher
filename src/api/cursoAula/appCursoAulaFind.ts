import ApiResponseHandler from '../apiResponseHandler';
import CursoAulaService from '../../services/cursoAulaService';

export default async (req, res, next) => {
  try {

    const payload = await new CursoAulaService(req).appFindById(
      req.params.aula,
    );

    await ApiResponseHandler.success(req, res, payload);
  } catch (error) {
    await ApiResponseHandler.error(req, res, error);
  }
};
