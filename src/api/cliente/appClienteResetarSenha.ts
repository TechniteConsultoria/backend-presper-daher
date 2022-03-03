import ApiResponseHandler from '../apiResponseHandler';
import ClienteService from '../../services/clienteService';
import Error400 from '../../errors/Error400';
import Error403 from '../../errors/Error403';


export default async (req, res, next) => {
  try {

    const valid = await new ClienteService(req).checkIdTokenHash(
      req.params.id,
      req.params.token,
      req.params.hash,
      );

      if (valid == 1){
        if (req.body.data.senha == req.body.data.senha_confirmar) {
          const cliente = await new ClienteService(req).appUpdate(
            req.params.id,
            req.body.data
          );
          await ApiResponseHandler.success(req, res, cliente);
        }
    
        else{
          throw new Error400('pt_BR', 1);
        }
      }

      else{
        throw new Error403('pt-BR', 1)
      }
    

  } catch (error) {
    await ApiResponseHandler.error(req, res, error);
  }
};
