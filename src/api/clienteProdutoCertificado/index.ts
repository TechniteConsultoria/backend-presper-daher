export default (app) => {
  app.post(
    `/tenant/:tenantId/clienteProdutoCertificado`,
    require('./clienteProdutoCertificadoCreate').default,
  );
  app.put(
    `/tenant/:tenantId/clienteProdutoCertificado/:id`,
    require('./clienteProdutoCertificadoUpdate').default,
  );
  app.delete(
    `/tenant/:tenantId/clienteProdutoCertificado`,
    require('./clienteProdutoCertificadoDestroy').default,
  );
  app.delete(
    `/tenant/:tenantId/clienteProdutoCertificadoDeleteOne/:id`,
    require('./clienteProdutoCertificadoDestroyOne').default,
  );
  app.get(
    `/tenant/:tenantId/clienteProdutoCertificado`,
    require('./clienteProdutoCertificadoList').default,
  );

  app.get(
    `/tenant/:tenantId/clienteProdutoCertificado/:id`,
    require('./clienteProdutoCertificadoFind').default,
  );

};
