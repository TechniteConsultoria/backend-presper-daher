export default (app) => {
  app.post(
    `/tenant/:tenantId/pilula-sou-leve`,
    require('./pilulaSouLeveCreate').default,
  );
  app.put(
    `/tenant/:tenantId/pilula-sou-leve/:id`,
    require('./pilulaSouLeveUpdate').default,
  );
  app.post(
    `/tenant/:tenantId/pilula-sou-leve/import`,
    require('./pilulaSouLeveImport').default,
  );
  app.delete(
    `/tenant/:tenantId/pilula-sou-leve`,
    require('./pilulaSouLeveDestroy').default,
  );
  app.get(
    `/tenant/:tenantId/pilula-sou-leve/autocomplete`,
    require('./pilulaSouLeveAutocomplete').default,
  );
  app.get(
    `/tenant/:tenantId/pilula-sou-leve`,
    require('./pilulaSouLeveList').default,
  );
  app.get(
    `/tenant/:tenantId/pilula-sou-leve/:id`,
    require('./pilulaSouLeveFind').default,
  );

//Rotas App
  app.get(
  `/app/cliente/:id/:token/pilula-sou-leve`,
  require('./appPilulaSouLeveList').default,
  );
  app.get(
  `/app/cliente/:id/:token/pilula-sou-leve/:pilula`,
  require('./appPilulaSouLeveFind').default,
  );

};
