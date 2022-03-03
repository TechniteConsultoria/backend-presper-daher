export default (app) => {
  app.post(
    `/tenant/:tenantId/programa-atividade-item`,
    require('./programaAtividadeItemCreate').default,
  );
  app.put(
    `/tenant/:tenantId/programa-atividade-item/:id`,
    require('./programaAtividadeItemUpdate').default,
  );
  app.post(
    `/tenant/:tenantId/programa-atividade-item/import`,
    require('./programaAtividadeItemImport').default,
  );
  app.delete(
    `/tenant/:tenantId/programa-atividade-item`,
    require('./programaAtividadeItemDestroy').default,
  );
  app.get(
    `/tenant/:tenantId/programa-atividade-item/autocomplete`,
    require('./programaAtividadeItemAutocomplete').default,
  );
  app.get(
    `/tenant/:tenantId/programa-atividade-item`,
    require('./programaAtividadeItemList').default,
  );
  app.get(
    `/tenant/:tenantId/programa-atividade-item/:id`,
    require('./programaAtividadeItemFind').default,
  );  
  //Rotas App
    //Listar atividades
    app.get(
      `/app/cliente/:id/:token/atividades`,
      require('./appListAtividades').default,
    );
    //setar cliente na atividade
  app.put(
    `/app/cliente/:id/:token/atividades/:programaAtividadeItemId`,
    require('./appSetCliente').default,
  );
};
