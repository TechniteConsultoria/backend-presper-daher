export default (app) => {
  app.post(
    `/tenant/:tenantId/categoria`,
    require('./categoriaCreate').default,
  );
  app.put(
    `/tenant/:tenantId/categoria/:id`,
    require('./categoriaUpdate').default,
  );
  app.post(
    `/tenant/:tenantId/categoria/import`,
    require('./categoriaImport').default,
  );
  app.delete(
    `/tenant/:tenantId/categoria`,
    require('./categoriaDestroy').default,
  );
  app.delete(
    `/tenant/:tenantId/categoria/:id`,
    require('./categoriaDestroyOne').default,
  );
  app.get(
    `/tenant/:tenantId/categoria/autocomplete`,
    require('./categoriaAutocomplete').default,
  );
  app.get(
    `/categoria`,
    require('./categoriaList').default,
  );
  app.get(
    `/tenant/:tenantId/categoria/:id`,
    require('./categoriaFind').default,
  );

  app.get(
    `/categoria-name/:id`,
    require('./categoriaFindByName').default,
  );


  app.get(
    `/categoria-aprovados`,
    require('./categoriaListAprovados').default,
  );
  app.get(
    `/categoria-aprovados-is-fixed`,
    require('./categoriaListAprovadosIsFixed').default,
  );
};
