export default (app) => {
  // app.post(
  //   `/notificacaoCliente`,
  //   require('./notificacaoClienteCreate').default,
  // );
  // app.put(
  //   `/notificacaoCliente/:id`,
  //   require('./notificacaoClienteUpdate').default,
  // );
  // app.put(
  //   `/notificacaoCliente/finalizar/:idNotificacaoCliente/:idNotificacao`,
  //   require('./notificacaoUpdate').default,
  // );
  // app.post(
  //   `/notificacaoCliente/import`,
  //   require('./notificacaoClienteImport').default,
  // );
  // app.delete(
  //   `/notificacaoCliente`,
  //   require('./notificacaoClienteDestroy').default,
  // );
  // app.get(
  //   `/notificacaoCliente/autocomplete`,
  //   require('./notificacaoClienteAutocomplete').default,
  // );
  // app.get(
  //   `/notificacaoCliente`,
  //   require('./notificacaoClienteList').default,
  // );
  // app.get(
  //   `/notificacaoCliente/:id/:cliente`,
  //   require('./notificacaoClienteFind').default,
  // );

  app.get(
    `/agendaNotificacao`,
    require('./notificacaoClienteList').default,
  )
};
