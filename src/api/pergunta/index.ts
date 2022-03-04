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
    `/tenant/:tenantId/pergunta`,
    require('./perguntaList').default,
  );
  app.get(
    `/tenant/:tenantId/find-pergunta/:id`,
    require('./perguntaFind').default,
  );
  app.get(
    `/tenant/:tenantId/findByProduto/:id`,
    require('./perguntaListByProduto').default,
  );

  app.get(
    `/tenant/:tenantId/findByEmpresa/:id`,
    require('./perguntaByEmpresa').default,
  );
  // app.post(
  //   `/tenant/:tenantId/pergunta`,
  //   require('./perguntaFindByProduto').default,
  // );
  
  
};
