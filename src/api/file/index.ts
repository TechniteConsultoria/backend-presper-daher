export default (app) => {
  app.post(
    `/file/upload`,
    require('./localhost/upload').default,
  );
  app.get(
    `/file/download`,
    require('./localhost/download').default,
  );
  app.get(
    `/tenant/:tenantId/file/credentials`,
    require('./credentials').default,
  );

  //Rotas App
  app.get(
    `/app/cliente/:id/:token/file/credentials/:filename`,
    require('./appCredentials').default,
  );

  app.post(
    `/app/cliente/:id/:token/file/upload`,
    require('./localhost/appUpload').default,
  );
  app.get(
    `/app/cliente/:id/:token/file/download`,
    require('./localhost/appDownload').default,
  );
};
