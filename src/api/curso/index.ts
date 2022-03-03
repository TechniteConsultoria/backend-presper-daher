export default (app) => {
  app.post(
    `/tenant/:tenantId/curso`,
    require('./cursoCreate').default,
  );
  app.put(
    `/tenant/:tenantId/curso/:id`,
    require('./cursoUpdate').default,
  );
  app.post(
    `/tenant/:tenantId/curso/import`,
    require('./cursoImport').default,
  );
  app.delete(
    `/tenant/:tenantId/curso`,
    require('./cursoDestroy').default,
  );
  app.get(
    `/tenant/:tenantId/curso/autocomplete`,
    require('./cursoAutocomplete').default,
  );
  app.get(
    `/tenant/:tenantId/curso`,
    require('./cursoList').default,
  );
  app.get(
    `/tenant/:tenantId/curso/:id`,
    require('./cursoFind').default,
  );

//Rotas App
/*   app.get(
    `/app/cliente/:id/:token/curso`,
    require('./appCursoList').default,
  );
  app.get(
    `/app/cliente/:id/:token/curso/:curso`,
    require('./appCursoFind').default,
  ); */
};
