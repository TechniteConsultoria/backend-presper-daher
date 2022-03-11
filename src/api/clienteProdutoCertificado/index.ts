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
    `/clienteProdutoCertificado`,
    require('./clienteProdutoCertificadoListWithoutLogin').default,
  );

  app.get(
    `/clienteProdutoCertificado-list`,
    require('./clienteProdutoCertificadoListWithoutLoginAndWithoutTenant').default,
  );

  app.get(
    `/clienteProdutoCertificadoTrue`,
    require('./clienteProdutoCertificadoListWithoutLoginTrue').default,
  );
  app.get(
    `/ativo-clienteProdutoCertificado`,
    require('./clienteProdutoCertificadoFindLimitedWithoutLogin').default, // esse
  );
  app.get(
    `/tenant/:tenantId/clienteProdutoCertificado/:id`,
    require('./clienteProdutoCertificadoFind').default,
  );
  app.get(
    `/clienteProdutoCertificado/:id`,
    require('./clienteProdutoCertificadoFindById').default,
  );
};
