import SequelizeRepository from '../../database/repositories/sequelizeRepository'
import AuditLogRepository from '../../database/repositories/auditLogRepository'
import lodash from 'lodash'
import SequelizeFilterUtils from '../../database/utils/sequelizeFilterUtils'
import Error404 from '../../errors/Error404'
import Sequelize from 'sequelize'
import FileRepository from './fileRepository'
import { IRepositoryOptions } from './IRepositoryOptions'
import Error400 from '../../errors/Error400'
import ptBR from '../../i18n/pt-BR'
import { Md5 } from 'ts-md5'
import { v4 as uuidv4 } from 'uuid'
import Error403 from '../../errors/Error403'
import regiao from '../models/regiao'
import RegiaoService from '../../services/regiaoService'
import { getConfig } from '../../config'
require('dotenv').config()

const highlight = require('cli-highlight').highlight
const Op = Sequelize.Op

/**
 * Handles database operations for the Cliente.
 * See https://sequelize.org/v5/index.html to learn how to customize it.
 */
class ClienteRepository {
  /**
   * Creates the Cliente.
   *
   * @param {Object} data
   * @param {Object} [options]
   */
  static async create (data, options: IRepositoryOptions) {
    const currentUser = SequelizeRepository.getCurrentUser(
      options,
    )

    const tenant = SequelizeRepository.getCurrentTenant(
      options,
    )

    const transaction = SequelizeRepository.getTransaction(
      options,
    )

    const record = await options.database.cliente.create(
      {
        ...lodash.pick(data, [
          'cpf',
          'nascimento',
          'nome',
          'genero',
          'email',
          'senha',
          'token',
          'recuperarSenha',
          'cep',
          'whatsapp',
          'telefone',
          'uf',
          'cidade',
          'bairro',
          'logradouro',
          'numero',
          'complemento',
          'importHash',
        ]),
        tenantId: tenant.id,
        createdById: currentUser.id,
        updatedById: currentUser.id,
      },
      {
        transaction,
      },
    )

    await FileRepository.replaceRelationFiles(
      {
        belongsTo: options.database.cliente.getTableName(),
        belongsToColumn: 'foto',
        belongsToId: record.id,
      },
      data.foto,
      options,
    )

    await this._createAuditLog(
      AuditLogRepository.CREATE,
      record,
      data,
      options,
    )

    let seq = new (<any>Sequelize)(
      getConfig().DATABASE_DATABASE,
      getConfig().DATABASE_USERNAME,
      getConfig().DATABASE_PASSWORD,
      {
        host: getConfig().DATABASE_HOST,
        dialect: getConfig().DATABASE_DIALECT,
        logging:
          getConfig().DATABASE_LOGGING === 'true'
            ? (log) =>
                console.log(
                  highlight(log, {
                    language: 'sql',
                    ignoreIllegals: true,
                  }),
                )
            : false,
      },
    )

    const { QueryTypes } = require('sequelize')

    const questionariosLiberados = await seq.query(
      "select * from questionarios where liberado = 'sim' and deletedAt is null;",
      { type: QueryTypes.SELECT },
    )

    let questionariosId = new Array()

    for (
      let i = 0;
      i < questionariosLiberados.length;
      i++
    ) {
      let element = questionariosLiberados[i]
      questionariosId.push(element['id'])
    }

    //console.log(questionariosId)

    let novaAvaliacao = {
      altura: null,
      bioimpedancia: [],
      bioressonancia: [],
      cliente: record.id,
      data: new Date(),
      dataBioimpedancia: null,
      dataBioressonancia: null,
      dieta: [],
      imc: null,
      peso: null,
      questionario: questionariosId,
    }

    //console.log(record)
    await this.criarAvaliacao(
      novaAvaliacao,
      options,
      tenant.id,
    )

    return this.findById(record.id, options)
  }

  //Criar Avaliacao
  static async criarAvaliacao (
    data,
    options: IRepositoryOptions,
    tenant,
  ) {
    const transaction = SequelizeRepository.getTransaction(
      options,
    )

    const record = await options.database.avaliacao.create(
      {
        ...lodash.pick(data, [
          'data',
          'dataBioimpedancia',
          'dataBioressonancia',
          'peso',
          'altura',
          'imc',
          'importHash',
        ]),
        tenantId: tenant,
      },
      {
        transaction,
      },
    )

    await record.setCliente(data.cliente || null, {
      transaction,
    })

    await record.setQuestionario(data.questionario || [], {
      transaction,
    })

    await FileRepository.replaceRelationFiles(
      {
        belongsTo: options.database.avaliacao.getTableName(),
        belongsToColumn: 'dieta',
        belongsToId: record.id,
      },
      data.dieta,
      options,
    )
    await FileRepository.replaceRelationFiles(
      {
        belongsTo: options.database.avaliacao.getTableName(),
        belongsToColumn: 'bioimpedancia',
        belongsToId: record.id,
      },
      data.bioimpedancia,
      options,
    )
    await FileRepository.replaceRelationFiles(
      {
        belongsTo: options.database.avaliacao.getTableName(),
        belongsToColumn: 'bioressonancia',
        belongsToId: record.id,
      },
      data.bioressonancia,
      options,
    )

    await this._createAuditLog(
      AuditLogRepository.CREATE,
      record,
      data,
      options,
    )

    //return this.findById(record.id, options)
  }

  /**
   * Updates the Cliente.
   *
   * @param {Object} data
   * @param {Object} [options]
   */
  static async update (
    id,
    data,
    options: IRepositoryOptions,
  ) {
    const currentUser = SequelizeRepository.getCurrentUser(
      options,
    )

    const transaction = SequelizeRepository.getTransaction(
      options,
    )

    let record = await options.database.cliente.findByPk(
      id,
      {
        transaction,
      },
    )

    const tenant = SequelizeRepository.getCurrentTenant(
      options,
    )

    if (
      !record ||
      String(record.tenantId) !== String(tenant.id)
    ) {
      throw new Error404()
    }

    record = await record.update(
      {
        ...lodash.pick(data, [
          'cpf',
          'nascimento',
          'nome',
          'genero',
          'email',
          'senha',
          'token',
          'recuperarSenha',
          'cep',
          'whatsapp',
          'telefone',
          'uf',
          'cidade',
          'bairro',
          'logradouro',
          'numero',
          'complemento',
          'importHash',
        ]),
        updatedById: currentUser.id,
      },
      {
        transaction,
      },
    )

    await FileRepository.replaceRelationFiles(
      {
        belongsTo: options.database.cliente.getTableName(),
        belongsToColumn: 'foto',
        belongsToId: record.id,
      },
      data.foto,
      options,
    )

    await this._createAuditLog(
      AuditLogRepository.UPDATE,
      record,
      data,
      options,
    )

    return this.findById(record.id, options)
  }

  /**
   * Deletes the Cliente.
   *
   * @param {string} id
   * @param {Object} [options]
   */
  static async destroy (id, options: IRepositoryOptions) {
    const transaction = SequelizeRepository.getTransaction(
      options,
    )

    let record = await options.database.cliente.findByPk(
      id,
      {
        transaction,
      },
    )

    const tenant = SequelizeRepository.getCurrentTenant(
      options,
    )

    if (
      !record ||
      String(record.tenantId) !== String(tenant.id)
    ) {
      throw new Error404()
    }

    await record.destroy({
      transaction,
    })

    await this._createAuditLog(
      AuditLogRepository.DELETE,
      record,
      record,
      options,
    )
  }

  /**
   * Finds the Cliente and its relations.
   *
   * @param {string} id
   * @param {Object} [options]
   */
  static async findById (id, options: IRepositoryOptions) {
    const transaction = SequelizeRepository.getTransaction(
      options,
    )

    const include = []

    const record = await options.database.cliente.findByPk(
      id,
      {
        attributes: {
          exclude: [
            'emailVerificado',
            'senha',
            'token',
            'recuperarSenha',
          ],
        },
        include,
        transaction,
      },
    )

    const tenant = SequelizeRepository.getCurrentTenant(
      options,
    )

    if (
      !record ||
      String(record.tenantId) !== String(tenant.id)
    ) {
      throw new Error404()
    }

    return this._fillWithRelationsAndFiles(record, options)
  }

  static async validateLogin (
    email,
    senha,
    options: IRepositoryOptions,
  ) {
    const include = []

    const cliente = await options.database.cliente.findAll({
      where: {
        email: email,
        senha: senha,
      },
    })

    //Caso o Login Não For Válido
    if (cliente == 0) {
      throw new Error403('pt-BR', 1)
    }

    if (cliente[0].emailVerificado == 0) {
      throw new Error403('pt-BR', 2)
    }

    return cliente
  }

  static generateToken (
    id,
    data,
    options: IRepositoryOptions,
  ) {
    const transaction = SequelizeRepository.getTransaction(
      options,
    )

    let record = options.database.cliente.update(
      {
        token: data.token,
      },
      {
        where: {
          id: id,
        },
      },
      {
        transaction,
      },
    )

    return this.findById(record.id, options)
  }

  static async checkIdToken (
    id,
    token,
    options: IRepositoryOptions,
  ) {
    const transaction = SequelizeRepository.getTransaction(
      options,
    )

    const record = await options.database.cliente.findAll(
      {
        where: {
          id: id,
          token: token,
        },
      },
      {
        transaction,
      },
    )

    let valid = 1

    if (record.length == 0) {
      valid = 0
    }

    return valid
  }

  static async checkIdTokenHash (
    id,
    token,
    hash,
    options: IRepositoryOptions,
  ) {
    const record = await options.database.cliente.findAll({
      where: {
        id: id,
        token: token,
        recuperarSenha: hash,
      },
    })

    let valid = 1

    if (record.length == 0) {
      valid = 0
    }

    return valid
  }

  static sendVerificationUpdateToken (
    id,
    token,
    options: IRepositoryOptions,
  ) {
    let record = options.database.cliente.update(
      {
        token: token,
      },
      {
        where: {
          id: id,
        },
      },
    )
  }

  static async generateRecuperarSenhaToken (
    id,
    token,
    options: IRepositoryOptions,
  ) {
    const hash = Md5.hashStr(uuidv4())

    let record = await options.database.cliente.update(
      {
        recuperarSenha: hash,
      },
      {
        where: {
          id: id,
          token: token,
        },
      },
    )

    if (record == 1) {
      return hash
    } else {
      throw new Error400()
    }
  }

  static verificarCliente (
    id,
    token,
    options: IRepositoryOptions,
  ) {
    let record = options.database.cliente.update(
      {
        emailVerificado: 1,
      },
      {
        where: {
          id: id,
          token: token,
        },
      },
    )
    return record
  }

  static async appCreate (
    data,
    options: IRepositoryOptions,
  ) {
    const currentUser = SequelizeRepository.getCurrentUser(
      options,
    )
    let tenantId = process.env.TENANT_ID || ''

    //Para aparecer na listagem do backoffice
    const tenant = tenantId

    const transaction = SequelizeRepository.getTransaction(
      options,
    )

    let exists = await options.database.cliente.findAll({
      where: {
        email: data.email,
        tenantId: tenant,
      },
    })

    if (exists.length > 0) {
      throw new Error400('pt-BR', 2)
    }

    const token = Md5.hashStr(uuidv4())

    const record = await options.database.cliente.create(
      {
        ...lodash.pick(data, [
          'cpf',
          'nascimento',
          'nome',
          'genero',
          'email',
          'senha',
          'cep',
          'whatsapp',
          'telefone',
          'uf',
          'cidade',
          'bairro',
          'logradouro',
          'numero',
          'complemento',
        ]),
        token: token,
        tenantId: tenant,
        createdById: currentUser.id,
        updatedById: currentUser.id,
      },
      {
        transaction,
      },
    )

    await FileRepository.replaceRelationFiles(
      {
        belongsTo: options.database.cliente.getTableName(),
        belongsToColumn: 'foto',
        belongsToId: record.id,
      },
      data.foto,
      options,
    )

    await this._createAuditLog(
      AuditLogRepository.CREATE,
      record,
      data,
      options,
    )

    let seq = new (<any>Sequelize)(
      getConfig().DATABASE_DATABASE,
      getConfig().DATABASE_USERNAME,
      getConfig().DATABASE_PASSWORD,
      {
        host: getConfig().DATABASE_HOST,
        dialect: getConfig().DATABASE_DIALECT,
        logging:
          getConfig().DATABASE_LOGGING === 'true'
            ? (log) =>
                console.log(
                  highlight(log, {
                    language: 'sql',
                    ignoreIllegals: true,
                  }),
                )
            : false,
      },
    )

    const { QueryTypes } = require('sequelize')

    const questionariosLiberados = await seq.query(
      "select * from questionarios where liberado = 'sim' and deletedAt is null;",
      { type: QueryTypes.SELECT },
    )

    let questionariosId = new Array()

    for (
      let i = 0;
      i < questionariosLiberados.length;
      i++
    ) {
      let element = questionariosLiberados[i]
      questionariosId.push(element['id'])
    }

    //console.log(questionariosId)

    let novaAvaliacao = {
      altura: null,
      bioimpedancia: [],
      bioressonancia: [],
      cliente: record.id,
      data: new Date(),
      dataBioimpedancia: null,
      dataBioressonancia: null,
      dieta: [],
      imc: null,
      peso: null,
      questionario: questionariosId,
    }

    //console.log(record)
    await this.criarAvaliacao(
      novaAvaliacao,
      options,
      tenant,
    )

    //console.log(novaAvaliacao)

    return record
  }

  static async appFindById (
    id,
    options: IRepositoryOptions,
  ) {
    const transaction = SequelizeRepository.getTransaction(
      options,
    )

    /* let include = {
      model: options.database.file,
      as: 'foto'
    }

    const record = await options.database.cliente.findAll(
      {
        where: {
          id: id,
        },
        include
      },
      {
        transaction,
      },
    ); */

    let seq = new (<any>Sequelize)(
      getConfig().DATABASE_DATABASE,
      getConfig().DATABASE_USERNAME,
      getConfig().DATABASE_PASSWORD,
      {
        host: getConfig().DATABASE_HOST,
        dialect: getConfig().DATABASE_DIALECT,
        logging:
          getConfig().DATABASE_LOGGING === 'true'
            ? (log) =>
                console.log(
                  highlight(log, {
                    language: 'sql',
                    ignoreIllegals: true,
                  }),
                )
            : false,
      },
    )
    const { QueryTypes } = require('sequelize')


    // 0 = GRATUITO
    //1 = INATIVO
    //2 = ATIVO
    let clientesArray = await seq.query(
      'SELECT `clientes`.`id`,  ' +
        ' `clientes`.`cpf`,  ' +
        ' `clientes`.`nascimento`,  ' +
        ' `clientes`.`nome`,  ' +
        ' `clientes`.`genero`,  ' +
        ' `clientes`.`email`,  ' +
        ' `clientes`.`token`,  ' +
        ' `clientes`.`cep`,  ' +
        ' `clientes`.`whatsapp`,  ' +
        ' `clientes`.`telefone`,  ' +
        ' `clientes`.`uf`,  ' +
        ' `clientes`.`cidade`,  ' +
        ' `clientes`.`bairro`,  ' +
        ' `clientes`.`logradouro`,  ' +
        ' `clientes`.`numero`,  ' +
        ' `clientes`.`complemento`,  ' +
        ' e.privateurl, ' +
        ' Max(CASE  ' +
        '       WHEN ( CASE  ' +
        '                 WHEN b.id IS NULL THEN 0  ' +
        '                ELSE 1  ' +
        '              end ) = 1 THEN ( CASE  ' +
        '                                WHEN Date_add(b.`data`,  ' +
        '                                    INTERVAL c.duracao day)  ' +
        '                                    >=  ' +
        '                                    Date(Now()) THEN 2  ' +
        '                              ELSE 1  ' +
        '                            end )  ' +
        '    ELSE 0  ' +
        '                            end) AS statusPlano  ' +
        'FROM   `clientes`  ' +
        'LEFT JOIN planoclientes b  ' +
        '      ON clientes.id = b.clienteid  ' +
        '        AND b.deletedat IS NULL  ' +
        'LEFT JOIN planos c  ' +
        '      ON b.planoid = c.id  ' +
        '        AND c.deletedat IS NULL  ' +
        'LEFT JOIN files e  ' +
        '      ON e.belongstoid = clientes.id  ' +
        "        AND belongsto = 'clientes'  " +
        ' WHERE  clientes.deletedat IS NULL  ' +
        "AND clientes.id = '"+id+"' " +
        'GROUP  BY clientes.id ',
      { type: QueryTypes.SELECT },
    )

    return clientesArray
  }

  static async appUpdate (
    id,
    data,
    options: IRepositoryOptions,
  ) {
    const transaction = SequelizeRepository.getTransaction(
      options,
    )

    let record = await options.database.cliente.findByPk(
      id,
      {
        transaction,
      },
    )

    record = await record.update(
      {
        ...lodash.pick(data, [
          'cpf',
          'nascimento',
          'nome',
          'genero',
          'email',
          'senha',
          'cep',
          'whatsapp',
          'telefone',
          'uf',
          'cidade',
          'bairro',
          'logradouro',
          'numero',
          'complemento',
        ]),
        updatedById: data.id,
        recuperarSenha: null,
      },
      {
        transaction,
      },
    )

    await FileRepository.replaceRelationFiles(
      {
        belongsTo: options.database.cliente.getTableName(),
        belongsToColumn: 'foto',
        belongsToId: record.id,
      },
      data.foto,
      options,
    )

    await this._createAuditLog(
      AuditLogRepository.UPDATE,
      record,
      data,
      options,
    )

    //return this.findById(record.id, options);
  }

  /**
   * Counts the number of Clientes based on the filter.
   *
   * @param {Object} filter
   * @param {Object} [options]
   */
  static async count (filter, options: IRepositoryOptions) {
    const transaction = SequelizeRepository.getTransaction(
      options,
    )

    const tenant = SequelizeRepository.getCurrentTenant(
      options,
    )

    return options.database.cliente.count(
      {
        where: {
          ...filter,
          tenantId: tenant.id,
        },
      },
      {
        transaction,
      },
    )
  }

  static async appFindByEmail (
    email,
    options: IRepositoryOptions,
  ) {
    let whereAnd: Array<any> = []
    let include = []

    whereAnd.push({
      email: email,
    })

    const where = { [Op.and]: whereAnd }

    let cliente = await options.database.cliente.findAll({
      where,
    })

    return cliente
  }

  /**
   * Lists the Clientes to populate the autocomplete.
   * See https://sequelize.org/v5/manual/querying.html to learn how to
   * customize the query.
   *
   * @param {Object} query
   * @param {number} limit
   */
  static async findAllAutocomplete (
    query,
    limit,
    options: IRepositoryOptions,
  ) {
    const tenant = SequelizeRepository.getCurrentTenant(
      options,
    )

    let where: any = {
      tenantId: tenant.id,
    }

    const currentUser = SequelizeRepository.getCurrentUser(
      options,
    )
    if (currentUser.usuarioMaster != 'Sim') {
      if (currentUser.afiliadoId == null) {
        where = {
          tenantId: tenant.id,
          ['id']: '0',
        }
      } else {
        const transaction = SequelizeRepository.getTransaction(
          options,
        )

        let regiao = await options.database.regiao.findAll({
          where: {
            afiliadoId: currentUser.afiliadoId,
          },
          transaction,
        })

        var bairros = ''
        var cidades: any[] = []
        var estados: any[] = []
        regiao.forEach((element) => {
          bairros += ';' + element.descricao + ';'
          cidades.push(element.cidade)
          estados.push(element.uf)
        })

        var bairrosValidados: string[] = []
        bairros.split(';').forEach((element) => {
          if (element != '') {
            bairrosValidados.push(element)
          }
        })

        where = {
          tenantId: tenant.id,
          uf: estados,
          cidade: cidades,
          bairro: bairrosValidados,
        }
      }
    }

    if (query) {
      where = {
        ...where,
        [Op.or]: [
          { ['id']: SequelizeFilterUtils.uuid(query) },
          {
            [Op.and]: SequelizeFilterUtils.ilike(
              'cliente',
              'nome',
              query,
            ),
          },
        ],
      }
    }

    const records = await options.database.cliente.findAll({
      attributes: ['id', 'nome'],
      where,
      limit: limit ? Number(limit) : undefined,
      orderBy: [['nome', 'ASC']],
    })

    return records.map((record) => ({
      id: record.id,
      label: record.nome,
    }))
  }

  static async findAndCountAll (
    { filter, limit = 0, offset = 0, orderBy = '' },
    options: IRepositoryOptions,
  ) {
    const tenant = SequelizeRepository.getCurrentTenant(
      options,
    )

    let whereAnd: Array<any> = []
    let include = []

    const currentUser = SequelizeRepository.getCurrentUser(
      options,
    )
    if (currentUser.usuarioMaster != 'Sim') {
      if (currentUser.afiliadoId == null) {
        whereAnd.push({
          ['id']: '0',
        })
      } else {
        const transaction = SequelizeRepository.getTransaction(
          options,
        )

        let regiao = await options.database.regiao.findAll({
          where: {
            afiliadoId: currentUser.afiliadoId,
          },
          transaction,
        })

        var bairros = ''
        var cidades: any[] = []
        var estados: any[] = []
        regiao.forEach((element) => {
          bairros += ';' + element.descricao + ';'
          cidades.push(element.cidade)
          estados.push(element.uf)
        })

        var bairrosValidados: string[] = []
        bairros.split(';').forEach((element) => {
          if (element != '') {
            bairrosValidados.push(element)
          }
        })

        whereAnd.push({
          uf: estados,
          cidade: cidades,
          bairro: bairrosValidados,
        })
      }
    } else {
      if (filter.token == 'Todos') {
      }

      if (filter.token == 'Sim') {
        const transaction = SequelizeRepository.getTransaction(
          options,
        )

        let regiao = await options.database.regiao.findAll({
          transaction,
        })

        var bairros = ''
        var cidades: any[] = []
        var estados: any[] = []
        regiao.forEach((element) => {
          bairros += ';' + element.descricao + ';'
          cidades.push(element.cidade)
          estados.push(element.uf)
        })

        var bairrosValidados: string[] = []
        bairros.split(';').forEach((element) => {
          if (element != '') {
            bairrosValidados.push(element)
          }
        })

        whereAnd.push({
          uf: { [Op.notIn]: estados },
          cidade: { [Op.notIn]: cidades },
          bairro: { [Op.notIn]: bairrosValidados },
        })
      }

      if (filter.token == 'Não') {
        const transaction = SequelizeRepository.getTransaction(
          options,
        )

        let regiao = await options.database.regiao.findAll({
          transaction,
        })

        var bairros = ''
        var cidades: any[] = []
        var estados: any[] = []
        regiao.forEach((element) => {
          bairros += ';' + element.descricao + ';'
          cidades.push(element.cidade)
          estados.push(element.uf)
        })

        var bairrosValidados: string[] = []
        bairros.split(';').forEach((element) => {
          if (element != '') {
            bairrosValidados.push(element)
          }
        })

        whereAnd.push({
          uf: estados,
          cidade: cidades,
          bairro: bairrosValidados,
        })
      }
    }

    whereAnd.push({
      tenantId: tenant.id,
    })

    if (filter) {
      if (filter.id) {
        whereAnd.push({
          ['id']: SequelizeFilterUtils.uuid(filter.id),
        })
      }

      if (filter.cpfRange) {
        const [start, end] = filter.cpfRange

        if (
          start !== undefined &&
          start !== null &&
          start !== ''
        ) {
          whereAnd.push({
            cpf: {
              [Op.gte]: start,
            },
          })
        }

        if (
          end !== undefined &&
          end !== null &&
          end !== ''
        ) {
          whereAnd.push({
            cpf: {
              [Op.lte]: end,
            },
          })
        }
      }

      if (filter.nascimentoRange) {
        const [start, end] = filter.nascimentoRange

        if (
          start !== undefined &&
          start !== null &&
          start !== ''
        ) {
          whereAnd.push({
            nascimento: {
              [Op.gte]: start,
            },
          })
        }

        if (
          end !== undefined &&
          end !== null &&
          end !== ''
        ) {
          whereAnd.push({
            nascimento: {
              [Op.lte]: end,
            },
          })
        }
      }

      if (filter.nome) {
        whereAnd.push(
          SequelizeFilterUtils.ilike(
            'cliente',
            'nome',
            filter.nome,
          ),
        )
      }

      if (filter.genero) {
        whereAnd.push({
          genero: filter.genero,
        })
      }

      if (filter.email) {
        whereAnd.push(
          SequelizeFilterUtils.ilike(
            'cliente',
            'email',
            filter.email,
          ),
        )
      }

      if (filter.cepRange) {
        const [start, end] = filter.cepRange

        if (
          start !== undefined &&
          start !== null &&
          start !== ''
        ) {
          whereAnd.push({
            cep: {
              [Op.gte]: start,
            },
          })
        }

        if (
          end !== undefined &&
          end !== null &&
          end !== ''
        ) {
          whereAnd.push({
            cep: {
              [Op.lte]: end,
            },
          })
        }
      }

      if (filter.whatsappRange) {
        const [start, end] = filter.whatsappRange

        if (
          start !== undefined &&
          start !== null &&
          start !== ''
        ) {
          whereAnd.push({
            whatsapp: {
              [Op.gte]: start,
            },
          })
        }

        if (
          end !== undefined &&
          end !== null &&
          end !== ''
        ) {
          whereAnd.push({
            whatsapp: {
              [Op.lte]: end,
            },
          })
        }
      }

      if (filter.telefoneRange) {
        const [start, end] = filter.telefoneRange

        if (
          start !== undefined &&
          start !== null &&
          start !== ''
        ) {
          whereAnd.push({
            telefone: {
              [Op.gte]: start,
            },
          })
        }

        if (
          end !== undefined &&
          end !== null &&
          end !== ''
        ) {
          whereAnd.push({
            telefone: {
              [Op.lte]: end,
            },
          })
        }
      }

      if (filter.uf) {
        whereAnd.push(
          SequelizeFilterUtils.ilike(
            'cliente',
            'uf',
            filter.uf,
          ),
        )
      }

      if (filter.cidade) {
        whereAnd.push(
          SequelizeFilterUtils.ilike(
            'cliente',
            'cidade',
            filter.cidade,
          ),
        )
      }

      if (filter.bairro) {
        whereAnd.push(
          SequelizeFilterUtils.ilike(
            'cliente',
            'bairro',
            filter.bairro,
          ),
        )
      }

      if (filter.logradouro) {
        whereAnd.push(
          SequelizeFilterUtils.ilike(
            'cliente',
            'logradouro',
            filter.logradouro,
          ),
        )
      }

      if (filter.numeroRange) {
        const [start, end] = filter.numeroRange

        if (
          start !== undefined &&
          start !== null &&
          start !== ''
        ) {
          whereAnd.push({
            numero: {
              [Op.gte]: start,
            },
          })
        }

        if (
          end !== undefined &&
          end !== null &&
          end !== ''
        ) {
          whereAnd.push({
            numero: {
              [Op.lte]: end,
            },
          })
        }
      }

      if (filter.complemento) {
        whereAnd.push(
          SequelizeFilterUtils.ilike(
            'cliente',
            'complemento',
            filter.complemento,
          ),
        )
      }

      if (filter.createdAtRange) {
        const [start, end] = filter.createdAtRange

        if (
          start !== undefined &&
          start !== null &&
          start !== ''
        ) {
          whereAnd.push({
            ['createdAt']: {
              [Op.gte]: start,
            },
          })
        }

        if (
          end !== undefined &&
          end !== null &&
          end !== ''
        ) {
          whereAnd.push({
            ['createdAt']: {
              [Op.lte]: end,
            },
          })
        }
      }
    }

    const where = { [Op.and]: whereAnd }

    let {
      rows,
      count,
    } = await options.database.cliente.findAndCountAll({
      attributes: {
        exclude: [
          'emailVerificado',
          'senha',
          'token',
          'recuperarSenha',
        ],
      },
      where,
      include,
      limit: limit ? Number(limit) : undefined,
      offset: offset ? Number(offset) : undefined,
      order: orderBy
        ? [orderBy.split('_')]
        : [['createdAt', 'DESC']],
      transaction: SequelizeRepository.getTransaction(
        options,
      ),
    })

    rows = await this._fillWithRelationsAndFilesForRows(
      rows,
      options,
    )

    return { rows, count }
  }

  /**
   * Creates an audit log of the operation.
   *
   * @param {string} action - The action [create, update or delete].
   * @param {object} record - The sequelize record
   * @param {object} data - The new data passed on the request
   * @param {object} options
   */
  static async _createAuditLog (
    action,
    record,
    data,
    options: IRepositoryOptions,
  ) {
    let values = {}

    if (data) {
      values = {
        ...record.get({ plain: true }),
        foto: data.foto,
      }
    }

    await AuditLogRepository.log(
      {
        entityName: 'cliente',
        entityId: record.id,
        action,
        values,
      },
      options,
    )
  }

  /**
   * Fills an array of Cliente with relations and files.
   *
   * @param {Array} rows
   * @param {Object} [options]
   */
  static async _fillWithRelationsAndFilesForRows (
    rows,
    options: IRepositoryOptions,
  ) {
    if (!rows) {
      return rows
    }

    return Promise.all(
      rows.map((record) =>
        this._fillWithRelationsAndFiles(record, options),
      ),
    )
  }

  /**
   * Fill the Cliente with the relations and files.
   *
   * @param {Object} record
   * @param {Object} [options]
   */
  static async _fillWithRelationsAndFiles (
    record,
    options: IRepositoryOptions,
  ) {
    if (!record) {
      return record
    }

    const output = record.get({ plain: true })

    const transaction = SequelizeRepository.getTransaction(
      options,
    )

    output.foto = await FileRepository.fillDownloadUrl(
      await record.getFoto({
        transaction,
      }),
    )

    return output
  }
}

export default ClienteRepository
