export default (app) => {
  app.post(
    `/tenant/:tenantId/produtoModulo`,
    require('./produtoModuloCreate').default,
  );
  app.put(
    `/tenant/:tenantId/produtoModulo/:id`,
    require('./produtoModuloUpdate').default,
  );
  app.put(
    `/tenant/:tenantId/produtoModuloStatusUpdate/:id`,
    require('./produtoModuloStatusUpdate').default,
  );
  app.post(
    `/tenant/:tenantId/produtoModulo/import`,
    require('./produtoModuloImport').default,
  );
  app.delete(
    `/tenant/:tenantId/produtoModulo`,
    require('./produtoModuloDestroy').default,
  );
  app.delete(
    `/tenant/:tenantId/produtoModuloDeleteOne/:id`,
    require('./produtoModuloDestroyOne').default,
  );
  app.get(
    `/tenant/:tenantId/produtoModulo/autocomplete`,
    require('./produtoModuloAutocomplete').default,
  );
  app.get(
    `/tenant/:tenantId/produtoModulo`,
    require('./produtoModuloList').default,
  );

  app.get(
    `/find-produtoModulo-by-id/:id`,
    require('./produtoModuloFindWithoutLogin').default,
  );

  app.put(
    `/tenant/:tenantId/produtoModulos/:id`,
    require('./produtoModuloAfterBuy').default,
  );
  // app.get(
  //   `/tenant/fa22705e-cf27-41d0-bebf-9a6ab52948c4/produtoModulo`,
  //   require('./produtoModuloList').default,
  // );

  app.get(
    `/produtoModulos`,
    require('./produtoModuloListWithoutLogin').default,
  );

  app.get(//this require a filter
    `/produtoModulos-list`,
    require('./produtoModuloListWithoutLoginAndWithoutTenant').default,
  );

  app.get(
    `/produtoModulosTrue`,
    require('./produtoModuloListWithoutLoginTrue').default,
  );
  app.get(
    `/limit-produtoModulos`,
    require('./produtoModuloFindLimitedWithoutLogin').default,
  );
  app.get(
    `/tenant/:tenantId/produtoModulo/:id`,
    require('./produtoModuloFind').default,
  );
  app.get(
    `/produtoModulo/:id`,
    require('./produtoModuloFindById').default,
  );
  app.get(
    `/produtoModulo-imagens-promocionais/`,
    require('./produtoModuloImagemPromocao').default,
  );

  app.delete(
    `/tenant/:tenantId/delete-produtoModulo-imagens-promocionais/:id`,
    require('./produtoModuloImagemPromocaoDelete').default,
  );
};
