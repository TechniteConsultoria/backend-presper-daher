export default (app) => {
  app.post(
    `/tenant/:tenantId/avaliacao`,
    require('./avaliacaoCreate').default,
  )
  app.put(
    `/tenant/:tenantId/avaliacao/:id`,
    require('./avaliacaoUpdate').default,
  )
  app.post(
    `/tenant/:tenantId/avaliacao/import`,
    require('./avaliacaoImport').default,
  )
  app.delete(
    `/tenant/:tenantId/avaliacao`,
    require('./avaliacaoDestroy').default,
  )
  app.get(
    `/tenant/:tenantId/avaliacao/autocomplete`,
    require('./avaliacaoAutocomplete').default,
  )
  app.get(
    `/tenant/:tenantId/avaliacao`,
    require('./avaliacaoList').default,
  )
  app.get(
    `/tenant/:tenantId/avaliacao/:id`,
    require('./avaliacaoFind').default,
  )
  //Rotas App
  //Avaliação
  app.get(
    `/app/cliente/:id/:token/avaliacao`,
    require('./appAvaliacaoList').default,
  )
  app.get(
    `/app/cliente/:id/:token/avaliacao/:avaliacao`,
    require('./appAvaliacaoFind').default,
  )
  app.get(
    `/app/cliente/:id/:token/questionariosPendentes`,
    require('./appAvaliacaoFindPendentes').default,
  )
  //Bioimpedância
  app.get(
    `/app/cliente/:id/:token/bioimpedancia`,
    require('./appBioimpedanciaList').default,
  )
  //Bioressonancia
  app.get(
    `/app/cliente/:id/:token/bioressonancia`,
    require('./appBioressonanciaList').default,
  )
  //Dieta
  app.get(
    `/app/cliente/:id/:token/dieta`,
    require('./appDietaList').default,
  )
  //registrar IMC
  app.post(
    `/app/cliente/:id/:token/avaliacao`,
    require('./appAvaliacaoCreate').default,
  )
  //listar id da avaliacao e do questionario
    app.get(
    `/app/getIds/cliente/:id`,
    require('./appAvaliacaoQuestionario').default,
  )
  //listar imc no app e backoffice
  app.get(
    `/app/cliente/:id/:token/graficos`,
    require('./appAvaliacaoImc').default,
  )
  //listar imc null no app
  app.get(
    `/app/cliente/:id/:token/imc`,
    require('./appAvaliacaoImcList').default,
  )
  //listar DISC no app e backoffice
  app.get(
   `/app/disc/:avaliacao/:questionario/:cliente`,
   require('./appAvaliacaoDisc').default,
 )
 //listar DISC no app e backoffice
 app.get(
  `/app/escala-cor/:avaliacao/:questionario/:cliente`,
  require('./appAvaliacaoEscalaCor').default,
)
   //listar roda da vida no app e backoffice
   app.get(
    `/app/rodaVida/:avaliacao/:questionario/:cliente`,
    require('./appAvaliacaoRodaVida').default,
  )

  
}
