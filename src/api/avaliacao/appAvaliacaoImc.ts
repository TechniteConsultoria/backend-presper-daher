import ApiResponseHandler from '../apiResponseHandler';
import AvaliacaoService from '../../services/avaliacaoService';

export default async (req, res, next) => {
  try {

    const payload = await new AvaliacaoService(
      req,
    ).appFindImc(req.params.id, req.query);

    await ApiResponseHandler.success(req, res, payload);
  } catch (error) {
    await ApiResponseHandler.error(req, res, error);
  }
};
