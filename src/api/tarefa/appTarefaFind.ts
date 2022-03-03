import ApiResponseHandler from '../apiResponseHandler';
import TarefaService from '../../services/tarefaService';

export default async (req, res, next) => {
  try {

    const payload = await new TarefaService(req).appFindById(
      req.params.tarefa,
    );

    await ApiResponseHandler.success(req, res, payload);
  } catch (error) {
    await ApiResponseHandler.error(req, res, error);
  }
};
