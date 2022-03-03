export default (app) => {
  app.post(
    `/tenant/:tenantId/programa-cliente`,
    require('./programaClienteCreate').default,
  );
  app.put(
    `/tenant/:tenantId/programa-cliente/:id`,
    require('./programaClienteUpdate').default,
  );
  app.post(
    `/tenant/:tenantId/programa-cliente/import`,
    require('./programaClienteImport').default,
  );
  app.delete(
    `/tenant/:tenantId/programa-cliente`,
    require('./programaClienteDestroy').default,
  );
  app.get(
    `/tenant/:tenantId/programa-cliente/autocomplete`,
    require('./programaClienteAutocomplete').default,
  );
  app.get(
    `/tenant/:tenantId/programa-cliente`,
    require('./programaClienteList').default,
  );
  app.get(
    `/tenant/:tenantId/programa-cliente/:id`,
    require('./programaClienteFind').default,
  );
};
