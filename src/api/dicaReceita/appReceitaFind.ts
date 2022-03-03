import ApiResponseHandler from '../apiResponseHandler';
import DicaReceitaService from '../../services/dicaReceitaService';

export default async (req, res, next) => {
  try {

    const payload = await new DicaReceitaService(req).appReceitaFindById(
      req.params.receita,
    );

    await ApiResponseHandler.success(req, res, payload);
  } catch (error) {
    await ApiResponseHandler.error(req, res, error);
  }
};
