export default (app) => {
  app.post(
    `/tenant/:tenantId/dica-receita`,
    require('./dicaReceitaCreate').default,
  );
  app.put(
    `/tenant/:tenantId/dica-receita/:id`,
    require('./dicaReceitaUpdate').default,
  );
  app.post(
    `/tenant/:tenantId/dica-receita/import`,
    require('./dicaReceitaImport').default,
  );
  app.delete(
    `/tenant/:tenantId/dica-receita`,
    require('./dicaReceitaDestroy').default,
  );
  app.get(
    `/tenant/:tenantId/dica-receita/autocomplete`,
    require('./dicaReceitaAutocomplete').default,
  );
  app.get(
    `/tenant/:tenantId/dica-receita`,
    require('./dicaReceitaList').default,
  );
  app.get(
    `/tenant/:tenantId/dica-receita/:id`,
    require('./dicaReceitaFind').default,
  );
  app.get(
    `/dica-receita/calendario`,
    require('./dicaReceitaCalendario').default,
  );


//Rotas App
  //Dica
  app.get(
    `/app/cliente/:id/:token/dica`,
    require('./appDicaList').default,
  );
  app.get(
    `/app/cliente/:id/:token/dica/:dica`,
    require('./appDicaFind').default,
  );
  //Receita
  app.get(
    `/app/cliente/:id/:token/receita`,
    require('./appReceitaList').default,
  );
  app.get(
    `/app/cliente/:id/:token/receita/:receita`,
    require('./appReceitaFind').default,
  );
  //Pilula
  app.get(
    `/app/cliente/:id/:token/pilula`,
    require('./appPilulaList').default,
  );
  app.get(
    `/app/cliente/:id/:token/pilula/:pilula`,
    require('./appPilulaFind').default,
  );

  
  //Produtos (Open)
  app.get(
    `/app/open/produto`,
    require('./appProdutoList').default,
  );
  app.get(
    `/app/open/produto/:produto`,
    require('./appProdutoFind').default,
  );

  /* app.get(
    `/app/cliente/:id/:token/produto`,
    require('./appProdutoList').default,
  );
  app.get(
    `/app/cliente/:id/:token/produto/:produto`,
    require('./appProdutoFind').default,
  ); */

};
