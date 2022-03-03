export default (app) => {
  app.post(
    `/tenant/:tenantId/tarefa`,
    require('./tarefaCreate').default,
  );
  app.post(
    `/tenant/:tenantId/tarefaDiasTarefas`,
    require('./tarefaCreateDiasTarefas').default,
  );
  app.put(
    `/tenant/:tenantId/tarefa/:id`,
    require('./tarefaUpdate').default,
  );
  app.delete(
    `/tenant/:tenantId/tarefa`,
    require('./tarefaDestroy').default,
  );
  app.get(
    `/tenant/:tenantId/tarefa/autocomplete`,
    require('./tarefaAutocomplete').default,
  );
  app.get(
    `/tenant/:tenantId/tarefa/autocompleteDistinct`,
    require('./tarefaAutocompleteDistinct').default,
  );
  app.get(
    `/tenant/:tenantId/tarefa`,
    require('./tarefaList').default,
  );
  app.get(
    `/tenant/:tenantId/tarefa/:id`,
    require('./tarefaFind').default,
  );

  //Rotas App
  app.get(
    `/app/avaliacao/:id/:token/tarefa`,
    require('./appTarefaList').default,
  );

  app.get(
    `/app/cliente/:id/:token/tarefa/:tarefa`,
    require('./appTarefaFind').default,
  );

  app.put(
    `/app/tarefa/:id/:token`,
    require('./appTarefaUpdate').default,
  );

};
