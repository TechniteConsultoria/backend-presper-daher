export default (app) => {
  
  app.post(
    `/tenant/:tenantId/comentario`,
    require('./comentarioCreate').default,
  );
  app.put(
    `/tenant/:tenantId/comentario/:id`,
    require('./comentarioUpdate').default,
  );
  app.get(
    `/tenant/:tenantId/comentario`,
    require('./comentarioList').default,
  );

  app.get(
    `/comentario`,
    require('./comentarioList').default,
  );


  app.get(
    `/tenant/:tenantId/find-comentario/:id`,
    require('./comentarioFind').default,
  );
  
  app.get(
    `/tenant/:tenantId/findByProduto/:id`,
    require('./comentarioListByProduto').default,
  );

  app.get(
    `/tenant/:tenantId/findByEmpresa/:id`,
    require('./comentarioByEmpresa').default,
  );

  app.delete(
    `/tenant/:tenantId/comentario/:id`,
    require('./comentarioDestroy').default,
  );
  
};
