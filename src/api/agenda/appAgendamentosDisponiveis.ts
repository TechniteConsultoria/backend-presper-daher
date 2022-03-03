import ApiResponseHandler from '../apiResponseHandler';
import AgendaService from '../../services/agendaService';

export default async (req, res, next) => {
  try {
    const payload = await new AgendaService(
      req,
    ).findAgendamentosDisponiveis(req.params.id);

    await ApiResponseHandler.success(req, res, payload);
  } catch (error) {
    await ApiResponseHandler.error(req, res, error);
  }
};
