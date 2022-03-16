export default (app) => {
  
  app.post(
    `/tenant/:tenantId/pergunta`,
    require('./perguntaCreate').default,
  );
  app.put(
    `/tenant/:tenantId/pergunta/:id`,
    require('./perguntaUpdate').default,
  );
  app.get(
    `/pergunta`,
    require('./perguntaList').default,
  );
  app.get(
    `/tenant/find-pergunta/:id`,
    require('./perguntaFind').default,
  );
  app.get(
    `/findByProduto/:id`,
    require('./perguntaListByProduto').default,
  );

  app.delete(
    `/tenant/:tenantId/pergunta/:id`,
    require('./perguntaDestroy').default,
  );
  
  
};
