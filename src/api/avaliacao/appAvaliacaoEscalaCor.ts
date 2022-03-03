import ApiResponseHandler from '../apiResponseHandler';
import AvaliacaoService from '../../services/avaliacaoService';

export default async (req, res, next) => {
  try {

    const payload = await new AvaliacaoService(
      req,
    ).appFindEscalaCor(req.params.avaliacao, req.params.questionario, req.params.cliente, req.query);

    await ApiResponseHandler.success(req, res, payload);
  } catch (error) {
    await ApiResponseHandler.error(req, res, error);
  }
};
