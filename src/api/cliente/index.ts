export default (app) => {
  app.post(
    `/tenant/:tenantId/cliente`,
    require('./clienteCreate').default,
  );
  app.put(
    `/tenant/:tenantId/cliente/:id`,
    require('./clienteUpdate').default,
  );
  app.post(
    `/tenant/:tenantId/cliente/import`,
    require('./clienteImport').default,
  );
  app.delete(
    `/tenant/:tenantId/cliente`,
    require('./clienteDestroy').default,
  );
  app.get(
    `/tenant/:tenantId/cliente/autocomplete`,
    require('./clienteAutocomplete').default,
  );
  app.get(
    `/tenant/:tenantId/cliente`,
    require('./clienteList').default,
  );
  app.get(
    `/tenant/:tenantId/cliente/:id`,
    require('./clienteFind').default,
  );

//Rotas App
  //Criar Cliente
  app.post(
    `/cliente/novo`,
    require('./appClienteCreate').default,
  );
  //Logar Cliente
  app.post(
    `/cliente/login`,
    require('./appClienteLogin').default,
  );
  //Perfil Cliente
  app.get(
    `/app/cliente/:id/:token`,
    require('./appClientePerfil').default,
  );
  //Atualizar Cliente
  app.put(
    `/app/cliente/:id/:token`,
    require('./appClienteUpdate').default,
  );
  //Verificar Cliente
  app.get(
    `/cliente/:id/:token/verificarEmail`,
    require('./appClienteVerificar').default,
  );
  //Resetar a Senha
  app.put(
    `/cliente/:id/:token/resetarSenha/:hash`,
    require('./appClienteResetarSenha').default,
  );
};
