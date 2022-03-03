/**
 * Storage permissions.
 *
 * @id - Used to identify the rule on permissions and upload.
 * @folder - Folder where the files will be saved
 * @maxSizeInBytes - Max allowed size in bytes
 * @bypassWritingPermissions - Does not validate if the user has permission to write
 * @publicRead - The file can be publicly accessed via the URL without the need for a signed token
 */
export default class Storage {
  static get values() {
    return {
      userAvatarsProfiles: {
        id: 'userAvatarsProfiles',
        folder: 'user/avatars/profile/:userId',
        maxSizeInBytes: 10 * 1024 * 1024,
        bypassWritingPermissions: true,
        publicRead: true,
      },
      settingsLogos: {
        id: 'settingsLogos',
        folder: 'tenant/:tenantId/settings/logos',
        maxSizeInBytes: 10 * 1024 * 1024,
        publicRead: true,
      },
      settingsBackgroundImages: {
        id: 'settingsBackgroundImages',
        folder:
          'tenant/:tenantId/settings/backgroundImages',
        maxSizeInBytes: 10 * 1024 * 1024,
        publicRead: true,
      },
      afiliadosFoto: {
        id: 'afiliadosFoto',
        folder: 'tenant/:tenantId/afiliados/foto',
        maxSizeInBytes: 100 * 1024 * 1024,
      },



      clienteFoto: {
        id: 'clienteFoto',
        folder: 'tenant/:tenantId/cliente/foto',
        maxSizeInBytes: 100 * 1024 * 1024,
      },

      avaliacaoDieta: {
        id: 'avaliacaoDieta',
        folder: 'tenant/:tenantId/avaliacao/dieta',
        maxSizeInBytes: 100 * 1024 * 1024,
      },
      avaliacaoBioimpedancia: {
        id: 'avaliacaoBioimpedancia',
        folder: 'tenant/:tenantId/avaliacao/bioimpedancia',
        maxSizeInBytes: 100 * 1024 * 1024,
      },
      avaliacaoBioressonancia: {
        id: 'avaliacaoBioressonancia',
        folder: 'tenant/:tenantId/avaliacao/bioressonancia',
        maxSizeInBytes: 100 * 1024 * 1024,
      },
      questionarioUploadPdf: {
        id: 'questionarioUploadPdf',
        folder: 'tenant/:tenantId/questionario/uploadPdf',
        maxSizeInBytes: 100 * 1024 * 1024,
        bypassWritingPermissions: true,
      },





      questionarioPerguntaFoto: {
        id: 'questionarioPerguntaFoto',
        folder: 'tenant/:tenantId/questionarioPergunta/foto',
        maxSizeInBytes: 100 * 1024 * 1024,
      },







      dicaReceitaImagem: {
        id: 'dicaReceitaImagem',
        folder: 'tenant/:tenantId/dicaReceita/imagem',
        maxSizeInBytes: 100 * 1024 * 1024,
      },

      programaImagem: {
        id: 'programaImagem',
        folder: 'tenant/:tenantId/programa/imagem',
        maxSizeInBytes: 100 * 1024 * 1024,
      },



      pilulaSouLeveAudio: {
        id: 'pilulaSouLeveAudio',
        folder: 'tenant/:tenantId/pilulaSouLeve/audio',
        maxSizeInBytes: 100 * 1024 * 1024,
      },



      cursoImagem: {
        id: 'cursoImagem',
        folder: 'tenant/:tenantId/curso/imagem',
        maxSizeInBytes: 100 * 1024 * 1024,
      },

      cursoModuloImagem: {
        id: 'cursoModuloImagem',
        folder: 'tenant/:tenantId/cursoModulo/imagem',
        maxSizeInBytes: 100 * 1024 * 1024,
      },

      cursoAulaImagem: {
        id: 'cursoAulaImagem',
        folder: 'tenant/:tenantId/cursoAula/imagem',
        maxSizeInBytes: 100 * 1024 * 1024,
      },
      cursoAulaApostila: {
        id: 'cursoAulaApostila',
        folder: 'tenant/:tenantId/cursoAula/apostila',
        maxSizeInBytes: 100 * 1024 * 1024,
      },
      cursoAulaQuestionario: {
        id: 'cursoAulaQuestionario',
        folder: 'tenant/:tenantId/cursoAula/questionario',
        maxSizeInBytes: 100 * 1024 * 1024,
      },
      planoImagem: {
        id: 'planoImagem',
        folder: 'tenant/:tenantId/plano/imagem',
        maxSizeInBytes: 100 * 1024 * 1024,
      },



      programaAtividadeImagem: {
        id: 'programaAtividadeImagem',
        folder: 'tenant/:tenantId/programaAtividade/imagem',
        maxSizeInBytes: 100 * 1024 * 1024,
      },




    };
  }
}
