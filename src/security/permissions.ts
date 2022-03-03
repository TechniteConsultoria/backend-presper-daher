import Roles from './roles';
import Plans from './plans';
import Storage from './storage';

const storage = Storage.values;
const roles = Roles.values;
const plans = Plans.values;

class Permissions {
  static get values() {
    return {
      tenantEdit: {
        id: 'tenantEdit',
        allowedRoles: [roles.admin],
        allowedPlans: [
          plans.free,
          plans.growth,
          plans.enterprise,
        ],
      },
      tenantDestroy: {
        id: 'tenantDestroy',
        allowedRoles: [roles.admin],
        allowedPlans: [
          plans.free,
          plans.growth,
          plans.enterprise,
        ],
      },
      planEdit: {
        id: 'planEdit',
        allowedRoles: [roles.admin],
        allowedPlans: [
          plans.free,
          plans.growth,
          plans.enterprise,
        ],
      },
      planRead: {
        id: 'planRead',
        allowedRoles: [roles.admin],
        allowedPlans: [
          plans.free,
          plans.growth,
          plans.enterprise,
        ],
      },
      userEdit: {
        id: 'userEdit',
        allowedRoles: [roles.admin],
        allowedPlans: [
          plans.free,
          plans.growth,
          plans.enterprise,
        ],
      },
      userDestroy: {
        id: 'userDestroy',
        allowedRoles: [roles.admin],
        allowedPlans: [
          plans.free,
          plans.growth,
          plans.enterprise,
        ],
      },
      userCreate: {
        id: 'userCreate',
        allowedRoles: [roles.admin],
        allowedPlans: [
          plans.free,
          plans.growth,
          plans.enterprise,
        ],
      },
      userImport: {
        id: 'userImport',
        allowedRoles: [roles.admin],
        allowedPlans: [
          plans.free,
          plans.growth,
          plans.enterprise,
        ],
      },
      userRead: {
        id: 'userRead',
        allowedRoles: [roles.admin],
        allowedPlans: [
          plans.free,
          plans.growth,
          plans.enterprise,
        ],
      },
      userAutocomplete: {
        id: 'userAutocomplete',
        allowedRoles: [roles.admin, roles.custom],
        allowedPlans: [
          plans.free,
          plans.growth,
          plans.enterprise,
        ],
      },
      auditLogRead: {
        id: 'auditLogRead',
        allowedRoles: [roles.admin],
        allowedPlans: [
          plans.free,
          plans.growth,
          plans.enterprise,
        ],
      },
      settingsEdit: {
        id: 'settingsEdit',
        allowedRoles: [roles.admin],
        allowedPlans: [
          plans.free,
          plans.growth,
          plans.enterprise,
        ],
        allowedStorage: [
          storage.settingsBackgroundImages,
          storage.settingsLogos,
        ],
      },
      afiliadosImport: {
        id: 'afiliadosImport',
        allowedRoles: [roles.admin],
        allowedPlans: [plans.free, plans.growth, plans.enterprise],
      },
      afiliadosCreate: {
        id: 'afiliadosCreate',
        allowedRoles: [roles.admin],
        allowedPlans: [plans.free, plans.growth, plans.enterprise],
        allowedStorage: [
          storage.afiliadosFoto,
        ],
      },
      afiliadosEdit: {
        id: 'afiliadosEdit',
        allowedRoles: [roles.admin],
        allowedPlans: [plans.free, plans.growth, plans.enterprise],
        allowedStorage: [
          storage.afiliadosFoto,
        ],
      },
      afiliadosDestroy: {
        id: 'afiliadosDestroy',
        allowedRoles: [roles.admin],
        allowedPlans: [plans.free, plans.growth, plans.enterprise],
        allowedStorage: [
          storage.afiliadosFoto,
        ],
      },
      afiliadosRead: {
        id: 'afiliadosRead',
        allowedRoles: [roles.admin, roles.custom],
        allowedPlans: [plans.free, plans.growth, plans.enterprise],
      },
      afiliadosAutocomplete: {
        id: 'afiliadosAutocomplete',
        allowedRoles: [roles.admin, roles.custom],
        allowedPlans: [plans.free, plans.growth, plans.enterprise],
      },

      regiaoImport: {
        id: 'regiaoImport',
        allowedRoles: [roles.admin],
        allowedPlans: [plans.free, plans.growth, plans.enterprise],
      },
      regiaoCreate: {
        id: 'regiaoCreate',
        allowedRoles: [roles.admin],
        allowedPlans: [plans.free, plans.growth, plans.enterprise],
        allowedStorage: [

        ],
      },
      regiaoEdit: {
        id: 'regiaoEdit',
        allowedRoles: [roles.admin],
        allowedPlans: [plans.free, plans.growth, plans.enterprise],
        allowedStorage: [

        ],
      },
      regiaoDestroy: {
        id: 'regiaoDestroy',
        allowedRoles: [roles.admin],
        allowedPlans: [plans.free, plans.growth, plans.enterprise],
        allowedStorage: [

        ],
      },
      regiaoRead: {
        id: 'regiaoRead',
        allowedRoles: [roles.admin, roles.custom],
        allowedPlans: [plans.free, plans.growth, plans.enterprise],
      },
      regiaoAutocomplete: {
        id: 'regiaoAutocomplete',
        allowedRoles: [roles.admin, roles.custom],
        allowedPlans: [plans.free, plans.growth, plans.enterprise],
      },

      clienteImport: {
        id: 'clienteImport',
        allowedRoles: [roles.admin],
        allowedPlans: [plans.free, plans.growth, plans.enterprise],
      },
      clienteCreate: {
        id: 'clienteCreate',
        allowedRoles: [roles.admin],
        allowedPlans: [plans.free, plans.growth, plans.enterprise],
        allowedStorage: [
          storage.clienteFoto,
        ],
      },
      clienteEdit: {
        id: 'clienteEdit',
        allowedRoles: [roles.admin],
        allowedPlans: [plans.free, plans.growth, plans.enterprise],
        allowedStorage: [
          storage.clienteFoto,
        ],
      },
      clienteDestroy: {
        id: 'clienteDestroy',
        allowedRoles: [roles.admin],
        allowedPlans: [plans.free, plans.growth, plans.enterprise],
        allowedStorage: [
          storage.clienteFoto,
        ],
      },
      clienteRead: {
        id: 'clienteRead',
        allowedRoles: [roles.admin, roles.custom],
        allowedPlans: [plans.free, plans.growth, plans.enterprise],
      },
      clienteAutocomplete: {
        id: 'clienteAutocomplete',
        allowedRoles: [roles.admin, roles.custom],
        allowedPlans: [plans.free, plans.growth, plans.enterprise],
      },

      avaliacaoImport: {
        id: 'avaliacaoImport',
        allowedRoles: [roles.admin],
        allowedPlans: [plans.free, plans.growth, plans.enterprise],
      },
      avaliacaoCreate: {
        id: 'avaliacaoCreate',
        allowedRoles: [roles.admin],
        allowedPlans: [plans.free, plans.growth, plans.enterprise],
        allowedStorage: [
          storage.avaliacaoDieta,
          storage.avaliacaoBioimpedancia,
          storage.avaliacaoBioressonancia,
        ],
      },
      avaliacaoEdit: {
        id: 'avaliacaoEdit',
        allowedRoles: [roles.admin],
        allowedPlans: [plans.free, plans.growth, plans.enterprise],
        allowedStorage: [
          storage.avaliacaoDieta,
          storage.avaliacaoBioimpedancia,
          storage.avaliacaoBioressonancia,
        ],
      },
      avaliacaoDestroy: {
        id: 'avaliacaoDestroy',
        allowedRoles: [roles.admin],
        allowedPlans: [plans.free, plans.growth, plans.enterprise],
        allowedStorage: [
          storage.avaliacaoDieta,
          storage.avaliacaoBioimpedancia,
          storage.avaliacaoBioressonancia,
        ],
      },
      avaliacaoRead: {
        id: 'avaliacaoRead',
        allowedRoles: [roles.admin, roles.custom],
        allowedPlans: [plans.free, plans.growth, plans.enterprise],
      },
      avaliacaoAutocomplete: {
        id: 'avaliacaoAutocomplete',
        allowedRoles: [roles.admin, roles.custom],
        allowedPlans: [plans.free, plans.growth, plans.enterprise],
      },

      questionarioTipoImport: {
        id: 'questionarioTipoImport',
        allowedRoles: [roles.admin],
        allowedPlans: [plans.free, plans.growth, plans.enterprise],
      },
      questionarioTipoCreate: {
        id: 'questionarioTipoCreate',
        allowedRoles: [roles.admin],
        allowedPlans: [plans.free, plans.growth, plans.enterprise],
        allowedStorage: [

        ],
      },
      questionarioTipoEdit: {
        id: 'questionarioTipoEdit',
        allowedRoles: [roles.admin],
        allowedPlans: [plans.free, plans.growth, plans.enterprise],
        allowedStorage: [

        ],
      },
      questionarioTipoDestroy: {
        id: 'questionarioTipoDestroy',
        allowedRoles: [roles.admin],
        allowedPlans: [plans.free, plans.growth, plans.enterprise],
        allowedStorage: [

        ],
      },
      questionarioTipoRead: {
        id: 'questionarioTipoRead',
        allowedRoles: [roles.admin, roles.custom],
        allowedPlans: [plans.free, plans.growth, plans.enterprise],
      },
      questionarioTipoAutocomplete: {
        id: 'questionarioTipoAutocomplete',
        allowedRoles: [roles.admin, roles.custom],
        allowedPlans: [plans.free, plans.growth, plans.enterprise],
      },

      questionarioImport: {
        id: 'questionarioImport',
        allowedRoles: [roles.admin],
        allowedPlans: [plans.free, plans.growth, plans.enterprise],
      },
      questionarioCreate: {
        id: 'questionarioCreate',
        allowedRoles: [roles.admin],
        allowedPlans: [plans.free, plans.growth, plans.enterprise],
        allowedStorage: [

        ],
      },
      questionarioEdit: {
        id: 'questionarioEdit',
        allowedRoles: [roles.admin],
        allowedPlans: [plans.free, plans.growth, plans.enterprise],
        allowedStorage: [

        ],
      },
      questionarioDestroy: {
        id: 'questionarioDestroy',
        allowedRoles: [roles.admin],
        allowedPlans: [plans.free, plans.growth, plans.enterprise],
        allowedStorage: [

        ],
      },
      questionarioRead: {
        id: 'questionarioRead',
        allowedRoles: [roles.admin, roles.custom],
        allowedPlans: [plans.free, plans.growth, plans.enterprise],
      },
      questionarioAutocomplete: {
        id: 'questionarioAutocomplete',
        allowedRoles: [roles.admin, roles.custom],
        allowedPlans: [plans.free, plans.growth, plans.enterprise],
      },

      questionarioPerguntaImport: {
        id: 'questionarioPerguntaImport',
        allowedRoles: [roles.admin],
        allowedPlans: [plans.free, plans.growth, plans.enterprise],
      },
      questionarioPerguntaCreate: {
        id: 'questionarioPerguntaCreate',
        allowedRoles: [roles.admin],
        allowedPlans: [plans.free, plans.growth, plans.enterprise],
        allowedStorage: [
          storage.questionarioPerguntaFoto,
        ],
      },
      questionarioPerguntaEdit: {
        id: 'questionarioPerguntaEdit',
        allowedRoles: [roles.admin],
        allowedPlans: [plans.free, plans.growth, plans.enterprise],
        allowedStorage: [
          storage.questionarioPerguntaFoto,
        ],
      },
      questionarioPerguntaDestroy: {
        id: 'questionarioPerguntaDestroy',
        allowedRoles: [roles.admin],
        allowedPlans: [plans.free, plans.growth, plans.enterprise],
        allowedStorage: [
          storage.questionarioPerguntaFoto,
        ],
      },
      questionarioPerguntaRead: {
        id: 'questionarioPerguntaRead',
        allowedRoles: [roles.admin, roles.custom],
        allowedPlans: [plans.free, plans.growth, plans.enterprise],
      },
      questionarioPerguntaAutocomplete: {
        id: 'questionarioPerguntaAutocomplete',
        allowedRoles: [roles.admin, roles.custom],
        allowedPlans: [plans.free, plans.growth, plans.enterprise],
      },

      questionarioClienteImport: {
        id: 'questionarioClienteImport',
        allowedRoles: [roles.admin],
        allowedPlans: [plans.free, plans.growth, plans.enterprise],
      },
      questionarioClienteCreate: {
        id: 'questionarioClienteCreate',
        allowedRoles: [roles.admin],
        allowedPlans: [plans.free, plans.growth, plans.enterprise],
        allowedStorage: [

        ],
      },
      questionarioClienteEdit: {
        id: 'questionarioClienteEdit',
        allowedRoles: [roles.admin],
        allowedPlans: [plans.free, plans.growth, plans.enterprise],
        allowedStorage: [

        ],
      },
      questionarioClienteDestroy: {
        id: 'questionarioClienteDestroy',
        allowedRoles: [roles.admin],
        allowedPlans: [plans.free, plans.growth, plans.enterprise],
        allowedStorage: [

        ],
      },
      questionarioClienteRead: {
        id: 'questionarioClienteRead',
        allowedRoles: [roles.admin, roles.custom],
        allowedPlans: [plans.free, plans.growth, plans.enterprise],
      },
      questionarioClienteAutocomplete: {
        id: 'questionarioClienteAutocomplete',
        allowedRoles: [roles.admin, roles.custom],
        allowedPlans: [plans.free, plans.growth, plans.enterprise],
      },

      questionarioClienteRespostaImport: {
        id: 'questionarioClienteRespostaImport',
        allowedRoles: [roles.admin],
        allowedPlans: [plans.free, plans.growth, plans.enterprise],
      },
      questionarioClienteRespostaCreate: {
        id: 'questionarioClienteRespostaCreate',
        allowedRoles: [roles.admin],
        allowedPlans: [plans.free, plans.growth, plans.enterprise],
        allowedStorage: [

        ],
      },
      questionarioClienteRespostaEdit: {
        id: 'questionarioClienteRespostaEdit',
        allowedRoles: [roles.admin],
        allowedPlans: [plans.free, plans.growth, plans.enterprise],
        allowedStorage: [

        ],
      },
      questionarioClienteRespostaDestroy: {
        id: 'questionarioClienteRespostaDestroy',
        allowedRoles: [roles.admin],
        allowedPlans: [plans.free, plans.growth, plans.enterprise],
        allowedStorage: [

        ],
      },
      questionarioClienteRespostaRead: {
        id: 'questionarioClienteRespostaRead',
        allowedRoles: [roles.admin, roles.custom],
        allowedPlans: [plans.free, plans.growth, plans.enterprise],
      },
      questionarioClienteRespostaAutocomplete: {
        id: 'questionarioClienteRespostaAutocomplete',
        allowedRoles: [roles.admin, roles.custom],
        allowedPlans: [plans.free, plans.growth, plans.enterprise],
      },

      agendaImport: {
        id: 'agendaImport',
        allowedRoles: [roles.admin],
        allowedPlans: [plans.free, plans.growth, plans.enterprise],
      },
      agendaCreate: {
        id: 'agendaCreate',
        allowedRoles: [roles.admin],
        allowedPlans: [plans.free, plans.growth, plans.enterprise],
        allowedStorage: [

        ],
      },
      agendaEdit: {
        id: 'agendaEdit',
        allowedRoles: [roles.admin],
        allowedPlans: [plans.free, plans.growth, plans.enterprise],
        allowedStorage: [

        ],
      },
      agendaDestroy: {
        id: 'agendaDestroy',
        allowedRoles: [roles.admin],
        allowedPlans: [plans.free, plans.growth, plans.enterprise],
        allowedStorage: [

        ],
      },
      agendaRead: {
        id: 'agendaRead',
        allowedRoles: [roles.admin, roles.custom],
        allowedPlans: [plans.free, plans.growth, plans.enterprise],
      },
      agendaAutocomplete: {
        id: 'agendaAutocomplete',
        allowedRoles: [roles.admin, roles.custom],
        allowedPlans: [plans.free, plans.growth, plans.enterprise],
      },

      dicaReceitaImport: {
        id: 'dicaReceitaImport',
        allowedRoles: [roles.admin],
        allowedPlans: [plans.free, plans.growth, plans.enterprise],
      },
      dicaReceitaCreate: {
        id: 'dicaReceitaCreate',
        allowedRoles: [roles.admin],
        allowedPlans: [plans.free, plans.growth, plans.enterprise],
        allowedStorage: [
          storage.dicaReceitaImagem,
        ],
      },
      dicaReceitaEdit: {
        id: 'dicaReceitaEdit',
        allowedRoles: [roles.admin],
        allowedPlans: [plans.free, plans.growth, plans.enterprise],
        allowedStorage: [
          storage.dicaReceitaImagem,
        ],
      },
      dicaReceitaDestroy: {
        id: 'dicaReceitaDestroy',
        allowedRoles: [roles.admin],
        allowedPlans: [plans.free, plans.growth, plans.enterprise],
        allowedStorage: [
          storage.dicaReceitaImagem,
        ],
      },
      dicaReceitaRead: {
        id: 'dicaReceitaRead',
        allowedRoles: [roles.admin, roles.custom],
        allowedPlans: [plans.free, plans.growth, plans.enterprise],
      },
      dicaReceitaAutocomplete: {
        id: 'dicaReceitaAutocomplete',
        allowedRoles: [roles.admin, roles.custom],
        allowedPlans: [plans.free, plans.growth, plans.enterprise],
      },

      programaImport: {
        id: 'programaImport',
        allowedRoles: [roles.admin],
        allowedPlans: [plans.free, plans.growth, plans.enterprise],
      },
      programaCreate: {
        id: 'programaCreate',
        allowedRoles: [roles.admin],
        allowedPlans: [plans.free, plans.growth, plans.enterprise],
        allowedStorage: [
          storage.programaImagem,
        ],
      },
      programaEdit: {
        id: 'programaEdit',
        allowedRoles: [roles.admin],
        allowedPlans: [plans.free, plans.growth, plans.enterprise],
        allowedStorage: [
          storage.programaImagem,
        ],
      },
      programaDestroy: {
        id: 'programaDestroy',
        allowedRoles: [roles.admin],
        allowedPlans: [plans.free, plans.growth, plans.enterprise],
        allowedStorage: [
          storage.programaImagem,
        ],
      },
      programaRead: {
        id: 'programaRead',
        allowedRoles: [roles.admin, roles.custom],
        allowedPlans: [plans.free, plans.growth, plans.enterprise],
      },
      programaAutocomplete: {
        id: 'programaAutocomplete',
        allowedRoles: [roles.admin, roles.custom],
        allowedPlans: [plans.free, plans.growth, plans.enterprise],
      },

      programaClienteImport: {
        id: 'programaClienteImport',
        allowedRoles: [roles.admin],
        allowedPlans: [plans.free, plans.growth, plans.enterprise],
      },
      programaClienteCreate: {
        id: 'programaClienteCreate',
        allowedRoles: [roles.admin],
        allowedPlans: [plans.free, plans.growth, plans.enterprise],
        allowedStorage: [

        ],
      },
      programaClienteEdit: {
        id: 'programaClienteEdit',
        allowedRoles: [roles.admin],
        allowedPlans: [plans.free, plans.growth, plans.enterprise],
        allowedStorage: [

        ],
      },
      programaClienteDestroy: {
        id: 'programaClienteDestroy',
        allowedRoles: [roles.admin],
        allowedPlans: [plans.free, plans.growth, plans.enterprise],
        allowedStorage: [

        ],
      },
      programaClienteRead: {
        id: 'programaClienteRead',
        allowedRoles: [roles.admin, roles.custom],
        allowedPlans: [plans.free, plans.growth, plans.enterprise],
      },
      programaClienteAutocomplete: {
        id: 'programaClienteAutocomplete',
        allowedRoles: [roles.admin, roles.custom],
        allowedPlans: [plans.free, plans.growth, plans.enterprise],
      },

      pilulaSouLeveImport: {
        id: 'pilulaSouLeveImport',
        allowedRoles: [roles.admin],
        allowedPlans: [plans.free, plans.growth, plans.enterprise],
      },
      pilulaSouLeveCreate: {
        id: 'pilulaSouLeveCreate',
        allowedRoles: [roles.admin],
        allowedPlans: [plans.free, plans.growth, plans.enterprise],
        allowedStorage: [
          storage.pilulaSouLeveAudio,
        ],
      },
      pilulaSouLeveEdit: {
        id: 'pilulaSouLeveEdit',
        allowedRoles: [roles.admin],
        allowedPlans: [plans.free, plans.growth, plans.enterprise],
        allowedStorage: [
          storage.pilulaSouLeveAudio,
        ],
      },
      pilulaSouLeveDestroy: {
        id: 'pilulaSouLeveDestroy',
        allowedRoles: [roles.admin],
        allowedPlans: [plans.free, plans.growth, plans.enterprise],
        allowedStorage: [
          storage.pilulaSouLeveAudio,
        ],
      },
      pilulaSouLeveRead: {
        id: 'pilulaSouLeveRead',
        allowedRoles: [roles.admin, roles.custom],
        allowedPlans: [plans.free, plans.growth, plans.enterprise],
      },
      pilulaSouLeveAutocomplete: {
        id: 'pilulaSouLeveAutocomplete',
        allowedRoles: [roles.admin, roles.custom],
        allowedPlans: [plans.free, plans.growth, plans.enterprise],
      },

      notificacaoImport: {
        id: 'notificacaoImport',
        allowedRoles: [roles.admin],
        allowedPlans: [plans.free, plans.growth, plans.enterprise],
      },
      notificacaoCreate: {
        id: 'notificacaoCreate',
        allowedRoles: [roles.admin],
        allowedPlans: [plans.free, plans.growth, plans.enterprise],
        allowedStorage: [

        ],
      },
      notificacaoEdit: {
        id: 'notificacaoEdit',
        allowedRoles: [roles.admin],
        allowedPlans: [plans.free, plans.growth, plans.enterprise],
        allowedStorage: [

        ],
      },
      notificacaoDestroy: {
        id: 'notificacaoDestroy',
        allowedRoles: [roles.admin],
        allowedPlans: [plans.free, plans.growth, plans.enterprise],
        allowedStorage: [

        ],
      },
      notificacaoRead: {
        id: 'notificacaoRead',
        allowedRoles: [roles.admin, roles.custom],
        allowedPlans: [plans.free, plans.growth, plans.enterprise],
      },
      notificacaoAutocomplete: {
        id: 'notificacaoAutocomplete',
        allowedRoles: [roles.admin, roles.custom],
        allowedPlans: [plans.free, plans.growth, plans.enterprise],
      },

      cursoImport: {
        id: 'cursoImport',
        allowedRoles: [roles.admin],
        allowedPlans: [plans.free, plans.growth, plans.enterprise],
      },
      cursoCreate: {
        id: 'cursoCreate',
        allowedRoles: [roles.admin],
        allowedPlans: [plans.free, plans.growth, plans.enterprise],
        allowedStorage: [
          storage.cursoImagem,
        ],
      },
      cursoEdit: {
        id: 'cursoEdit',
        allowedRoles: [roles.admin],
        allowedPlans: [plans.free, plans.growth, plans.enterprise],
        allowedStorage: [
          storage.cursoImagem,
        ],
      },
      cursoDestroy: {
        id: 'cursoDestroy',
        allowedRoles: [roles.admin],
        allowedPlans: [plans.free, plans.growth, plans.enterprise],
        allowedStorage: [
          storage.cursoImagem,
        ],
      },
      cursoRead: {
        id: 'cursoRead',
        allowedRoles: [roles.admin, roles.custom],
        allowedPlans: [plans.free, plans.growth, plans.enterprise],
      },
      cursoAutocomplete: {
        id: 'cursoAutocomplete',
        allowedRoles: [roles.admin, roles.custom],
        allowedPlans: [plans.free, plans.growth, plans.enterprise],
      },

      cursoModuloImport: {
        id: 'cursoModuloImport',
        allowedRoles: [roles.admin],
        allowedPlans: [plans.free, plans.growth, plans.enterprise],
      },
      cursoModuloCreate: {
        id: 'cursoModuloCreate',
        allowedRoles: [roles.admin],
        allowedPlans: [plans.free, plans.growth, plans.enterprise],
        allowedStorage: [
          storage.cursoModuloImagem,
        ],
      },
      cursoModuloEdit: {
        id: 'cursoModuloEdit',
        allowedRoles: [roles.admin],
        allowedPlans: [plans.free, plans.growth, plans.enterprise],
        allowedStorage: [
          storage.cursoModuloImagem,
        ],
      },
      cursoModuloDestroy: {
        id: 'cursoModuloDestroy',
        allowedRoles: [roles.admin],
        allowedPlans: [plans.free, plans.growth, plans.enterprise],
        allowedStorage: [
          storage.cursoModuloImagem,
        ],
      },
      cursoModuloRead: {
        id: 'cursoModuloRead',
        allowedRoles: [roles.admin, roles.custom],
        allowedPlans: [plans.free, plans.growth, plans.enterprise],
      },
      cursoModuloAutocomplete: {
        id: 'cursoModuloAutocomplete',
        allowedRoles: [roles.admin, roles.custom],
        allowedPlans: [plans.free, plans.growth, plans.enterprise],
      },

      cursoAulaImport: {
        id: 'cursoAulaImport',
        allowedRoles: [roles.admin],
        allowedPlans: [plans.free, plans.growth, plans.enterprise],
      },
      cursoAulaCreate: {
        id: 'cursoAulaCreate',
        allowedRoles: [roles.admin],
        allowedPlans: [plans.free, plans.growth, plans.enterprise],
        allowedStorage: [
          storage.cursoAulaImagem,
          storage.cursoAulaApostila,
          storage.cursoAulaQuestionario,
        ],
      },
      cursoAulaEdit: {
        id: 'cursoAulaEdit',
        allowedRoles: [roles.admin],
        allowedPlans: [plans.free, plans.growth, plans.enterprise],
        allowedStorage: [
          storage.cursoAulaImagem,
          storage.cursoAulaApostila,
          storage.cursoAulaQuestionario,
        ],
      },
      cursoAulaDestroy: {
        id: 'cursoAulaDestroy',
        allowedRoles: [roles.admin],
        allowedPlans: [plans.free, plans.growth, plans.enterprise],
        allowedStorage: [
          storage.cursoAulaImagem,
          storage.cursoAulaApostila,
          storage.cursoAulaQuestionario,
        ],
      },
      cursoAulaRead: {
        id: 'cursoAulaRead',
        allowedRoles: [roles.admin, roles.custom],
        allowedPlans: [plans.free, plans.growth, plans.enterprise],
      },
      cursoAulaAutocomplete: {
        id: 'cursoAulaAutocomplete',
        allowedRoles: [roles.admin, roles.custom],
        allowedPlans: [plans.free, plans.growth, plans.enterprise],
      },

      cursoClienteImport: {
        id: 'cursoClienteImport',
        allowedRoles: [roles.admin],
        allowedPlans: [plans.free, plans.growth, plans.enterprise],
      },
      cursoClienteCreate: {
        id: 'cursoClienteCreate',
        allowedRoles: [roles.admin],
        allowedPlans: [plans.free, plans.growth, plans.enterprise],
        allowedStorage: [

        ],
      },
      cursoClienteEdit: {
        id: 'cursoClienteEdit',
        allowedRoles: [roles.admin],
        allowedPlans: [plans.free, plans.growth, plans.enterprise],
        allowedStorage: [

        ],
      },
      cursoClienteDestroy: {
        id: 'cursoClienteDestroy',
        allowedRoles: [roles.admin],
        allowedPlans: [plans.free, plans.growth, plans.enterprise],
        allowedStorage: [

        ],
      },
      cursoClienteRead: {
        id: 'cursoClienteRead',
        allowedRoles: [roles.admin, roles.custom],
        allowedPlans: [plans.free, plans.growth, plans.enterprise],
      },
      cursoClienteAutocomplete: {
        id: 'cursoClienteAutocomplete',
        allowedRoles: [roles.admin, roles.custom],
        allowedPlans: [plans.free, plans.growth, plans.enterprise],
      },

      cursoClienteAulaImport: {
        id: 'cursoClienteAulaImport',
        allowedRoles: [roles.admin],
        allowedPlans: [plans.free, plans.growth, plans.enterprise],
      },
      cursoClienteAulaCreate: {
        id: 'cursoClienteAulaCreate',
        allowedRoles: [roles.admin],
        allowedPlans: [plans.free, plans.growth, plans.enterprise],
        allowedStorage: [

        ],
      },
      cursoClienteAulaEdit: {
        id: 'cursoClienteAulaEdit',
        allowedRoles: [roles.admin],
        allowedPlans: [plans.free, plans.growth, plans.enterprise],
        allowedStorage: [

        ],
      },
      cursoClienteAulaDestroy: {
        id: 'cursoClienteAulaDestroy',
        allowedRoles: [roles.admin],
        allowedPlans: [plans.free, plans.growth, plans.enterprise],
        allowedStorage: [

        ],
      },
      cursoClienteAulaRead: {
        id: 'cursoClienteAulaRead',
        allowedRoles: [roles.admin, roles.custom],
        allowedPlans: [plans.free, plans.growth, plans.enterprise],
      },
      cursoClienteAulaAutocomplete: {
        id: 'cursoClienteAulaAutocomplete',
        allowedRoles: [roles.admin, roles.custom],
        allowedPlans: [plans.free, plans.growth, plans.enterprise],
      }, 
      planoImport: {
        id: 'planoImport',
        allowedRoles: [roles.admin],
        allowedPlans: [plans.free, plans.growth, plans.enterprise],
      },
      planoCreate: {
        id: 'planoCreate',
        allowedRoles: [roles.admin],
        allowedPlans: [plans.free, plans.growth, plans.enterprise],
        allowedStorage: [
          storage.planoImagem,
        ],
      },
      planoEdit: {
        id: 'planoEdit',
        allowedRoles: [roles.admin],
        allowedPlans: [plans.free, plans.growth, plans.enterprise],
        allowedStorage: [
          storage.planoImagem,
        ],
      },
      planoDestroy: {
        id: 'planoDestroy',
        allowedRoles: [roles.admin],
        allowedPlans: [plans.free, plans.growth, plans.enterprise],
        allowedStorage: [
          storage.planoImagem,
        ],
      },
      planoRead: {
        id: 'planoRead',
        allowedRoles: [roles.admin, roles.custom],
        allowedPlans: [plans.free, plans.growth, plans.enterprise],
      },
      planoAutocomplete: {
        id: 'planoAutocomplete',
        allowedRoles: [roles.admin, roles.custom],
        allowedPlans: [plans.free, plans.growth, plans.enterprise],
      },

      tarefaCreate: {
        id: 'tarefaCreate',
        allowedRoles: [roles.admin],
        allowedPlans: [plans.free, plans.growth, plans.enterprise],
        allowedStorage: [
        ],
      },
      tarefaEdit: {
        id: 'tarefaEdit',
        allowedRoles: [roles.admin],
        allowedPlans: [plans.free, plans.growth, plans.enterprise],
        allowedStorage: [
        ],
      },
      tarefaDestroy: {
        id: 'tarefaDestroy',
        allowedRoles: [roles.admin],
        allowedPlans: [plans.free, plans.growth, plans.enterprise],
        allowedStorage: [
        ],
      },
      tarefaRead: {
        id: 'tarefaRead',
        allowedRoles: [roles.admin, roles.custom],
        allowedPlans: [plans.free, plans.growth, plans.enterprise],
      },
      tarefaAutocomplete: {
        id: 'tarefaAutocomplete',
        allowedRoles: [roles.admin, roles.custom],
        allowedPlans: [plans.free, plans.growth, plans.enterprise],
      },

      perguntaCreate: {
        id: 'perguntaCreate',
        allowedRoles: [roles.admin],
        allowedPlans: [plans.free, plans.growth, plans.enterprise],
        allowedStorage: [
        ],
      },
      perguntaEdit: {
        id: 'perguntaEdit',
        allowedRoles: [roles.admin],
        allowedPlans: [plans.free, plans.growth, plans.enterprise],
        allowedStorage: [
        ],
      },
      perguntaDestroy: {
        id: 'perguntaDestroy',
        allowedRoles: [roles.admin],
        allowedPlans: [plans.free, plans.growth, plans.enterprise],
        allowedStorage: [
        ],
      },
      perguntaRead: {
        id: 'perguntaRead',
        allowedRoles: [roles.admin, roles.custom],
        allowedPlans: [plans.free, plans.growth, plans.enterprise],
      },
      perguntaAutocomplete: {
        id: 'perguntaAutocomplete',
        allowedRoles: [roles.admin, roles.custom],
        allowedPlans: [plans.free, plans.growth, plans.enterprise],
      },

      planoClienteImport: {
        id: 'planoClienteImport',
        allowedRoles: [roles.admin],
        allowedPlans: [plans.free, plans.growth, plans.enterprise],
      },
      planoClienteCreate: {
        id: 'planoClienteCreate',
        allowedRoles: [roles.admin],
        allowedPlans: [plans.free, plans.growth, plans.enterprise],
        allowedStorage: [

        ],
      },
      planoClienteEdit: {
        id: 'planoClienteEdit',
        allowedRoles: [roles.admin],
        allowedPlans: [plans.free, plans.growth, plans.enterprise],
        allowedStorage: [

        ],
      },
      planoClienteDestroy: {
        id: 'planoClienteDestroy',
        allowedRoles: [roles.admin],
        allowedPlans: [plans.free, plans.growth, plans.enterprise],
        allowedStorage: [

        ],
      },
      planoClienteRead: {
        id: 'planoClienteRead',
        allowedRoles: [roles.admin, roles.custom],
        allowedPlans: [plans.free, plans.growth, plans.enterprise],
      },
      planoClienteAutocomplete: {
        id: 'planoClienteAutocomplete',
        allowedRoles: [roles.admin, roles.custom],
        allowedPlans: [plans.free, plans.growth, plans.enterprise],
      },

      programaAtividadeImport: {
        id: 'programaAtividadeImport',
        allowedRoles: [roles.admin],
        allowedPlans: [plans.free, plans.growth, plans.enterprise],
      },
      programaAtividadeCreate: {
        id: 'programaAtividadeCreate',
        allowedRoles: [roles.admin],
        allowedPlans: [plans.free, plans.growth, plans.enterprise],
        allowedStorage: [
          storage.programaAtividadeImagem,
        ],
      },
      programaAtividadeEdit: {
        id: 'programaAtividadeEdit',
        allowedRoles: [roles.admin],
        allowedPlans: [plans.free, plans.growth, plans.enterprise],
        allowedStorage: [
          storage.programaAtividadeImagem,
        ],
      },
      programaAtividadeDestroy: {
        id: 'programaAtividadeDestroy',
        allowedRoles: [roles.admin],
        allowedPlans: [plans.free, plans.growth, plans.enterprise],
        allowedStorage: [
          storage.programaAtividadeImagem,
        ],
      },
      programaAtividadeRead: {
        id: 'programaAtividadeRead',
        allowedRoles: [roles.admin, roles.custom],
        allowedPlans: [plans.free, plans.growth, plans.enterprise],
      },
      programaAtividadeAutocomplete: {
        id: 'programaAtividadeAutocomplete',
        allowedRoles: [roles.admin, roles.custom],
        allowedPlans: [plans.free, plans.growth, plans.enterprise],
      },

      programaAtividadeItemImport: {
        id: 'programaAtividadeItemImport',
        allowedRoles: [roles.admin],
        allowedPlans: [plans.free, plans.growth, plans.enterprise],
      },
      programaAtividadeItemCreate: {
        id: 'programaAtividadeItemCreate',
        allowedRoles: [roles.admin],
        allowedPlans: [plans.free, plans.growth, plans.enterprise],
        allowedStorage: [

        ],
      },
      programaAtividadeItemEdit: {
        id: 'programaAtividadeItemEdit',
        allowedRoles: [roles.admin],
        allowedPlans: [plans.free, plans.growth, plans.enterprise],
        allowedStorage: [

        ],
      },
      programaAtividadeItemDestroy: {
        id: 'programaAtividadeItemDestroy',
        allowedRoles: [roles.admin],
        allowedPlans: [plans.free, plans.growth, plans.enterprise],
        allowedStorage: [

        ],
      },
      programaAtividadeItemRead: {
        id: 'programaAtividadeItemRead',
        allowedRoles: [roles.admin, roles.custom],
        allowedPlans: [plans.free, plans.growth, plans.enterprise],
      },
      programaAtividadeItemAutocomplete: {
        id: 'programaAtividadeItemAutocomplete',
        allowedRoles: [roles.admin, roles.custom],
        allowedPlans: [plans.free, plans.growth, plans.enterprise],
      },
      
      
      // tarefaImport: {
      //   id: 'tarefaImport',
      //   allowedRoles: [roles.admin],
      //   allowedPlans: [plans.free, plans.growth, plans.enterprise],
      // },
      // tarefaCreate: {
      //   id: 'tarefaCreate',
      //   allowedRoles: [roles.admin],
      //   allowedPlans: [plans.free, plans.growth, plans.enterprise],
      //   allowedStorage: [

      //   ],
      // },
      // tarefaEdit: {
      //   id: 'tarefaEdit',
      //   allowedRoles: [roles.admin],
      //   allowedPlans: [plans.free, plans.growth, plans.enterprise],
      //   allowedStorage: [

      //   ],
      // },
      // tarefaDestroy: {
      //   id: 'tarefaDestroy',
      //   allowedRoles: [roles.admin],
      //   allowedPlans: [plans.free, plans.growth, plans.enterprise],
      //   allowedStorage: [

      //   ],
      // },
      // tarefaRead: {
      //   id: 'tarefaRead',
      //   allowedRoles: [roles.admin, roles.custom],
      //   allowedPlans: [plans.free, plans.growth, plans.enterprise],
      // },
      // tarefaAutocomplete: {
      //   id: 'tarefaAutocomplete',
      //   allowedRoles: [roles.admin, roles.custom],
      //   allowedPlans: [plans.free, plans.growth, plans.enterprise],
      // },

    }
  }

  static get asArray() {
    return Object.keys(this.values).map((value) => {
      return this.values[value];
    });
  }
}

export default Permissions;
