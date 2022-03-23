export default (app) => {
  app.post(
    `/tenant/:tenantId/produtoModulo`,
    require('./produtoModuloCreate').default,
  );
  app.put(
    `/tenant/:tenantId/produtoModulo/:id`,
    require('./produtoModuloUpdate').default,
  );
  app.delete(
    `/tenant/:tenantId/produtoModulo`,
    require('./produtoModuloDestroy').default,
  );
  app.delete(
    `/tenant/:tenantId/produtoModulo/:id`,
    require('./produtoModuloDestroyOne').default,
  );
  app.get(
    `/tenant/:tenantId/produtoModulo`,
    require('./produtoModuloList').default,
  );

  app.get(
    `/tenant/:tenantId/produtoModulo/:id`,
    require('./produtoModuloFind').default,
  );
};
