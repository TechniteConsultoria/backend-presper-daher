import Error403 from '../errors/Error403';
import ClienteService from '../services/clienteService';

export async function clienteMiddleware(
    req,
    res,
    next,
  ) {
    try {

      const id = req.params.id;
      const token = req.params.token;

      const valid = await new ClienteService(req).checkIdToken(id, token);
      
      if (valid != 1){
        throw new Error403();
      }  

      return next();

    } catch (error) {
      next(error);
    }
  }
