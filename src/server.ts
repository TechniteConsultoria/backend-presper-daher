/**
 * Starts the application on the port specified.
 */

require('dotenv').config();

import api from './api';
import ProdutoService from './services/produtoService';

const PORT = process.env.PORT || 7777;

// const updatePagamentos = async () => {
//   console.log('LAHA LEHE')

//   return await new ProdutoService(
//     'Evaldo Lindo'
//   ).updateAllDatabaseOfPagementos();
  
// }

// const updateIsOferta = async () => {

//   return await new ProdutoService(
//     'Evaldo Lindo'
//   ).updateAllIsOferta();
  
// }

api.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
    // setInterval(updatePagamentos, 1000 * 3600);
    // setInterval(updateIsOferta, 1000 * 43200);
    
    // setInterval(displayHello, 10000);


});
