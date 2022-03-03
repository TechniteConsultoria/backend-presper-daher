import ApiResponseHandler from '../apiResponseHandler';
import PilulaSouLeveService from '../../services/pilulaSouLeveService';

export default async (req, res, next) => {
  try {

    const payload = await new PilulaSouLeveService(
      req,
    ).appFindAndCountAll(req.query, req.params.id, req.params.token);

    await ApiResponseHandler.success(req, res, payload);
  } catch (error) {
    await ApiResponseHandler.error(req, res, error);
  }
};
