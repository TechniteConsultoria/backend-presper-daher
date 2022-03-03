import SequelizeRepository from '../../database/repositories/sequelizeRepository'
import AuditLogRepository from '../../database/repositories/auditLogRepository'
import lodash from 'lodash'
import SequelizeFilterUtils from '../../database/utils/sequelizeFilterUtils'
import Error404 from '../../errors/Error404'
import Sequelize from 'sequelize'
import { IRepositoryOptions } from './IRepositoryOptions'
import { getConfig } from '../../config'
import moment from 'moment'
import { createFalse } from 'typescript'

moment.locale('en')

const highlight = require('cli-highlight').highlight
const Op = Sequelize.Op

/**
 * Handles database operations for the Agenda.
 * See https://sequelize.org/v5/index.html to learn how to customize it.
 */
class AgendaRepository {
  /**
   * Creates the Agenda.
   *
   * @param {Object} data
   * @param {Object} [options]
   */
  static async create(data, options: IRepositoryOptions) {
    const currentUser = SequelizeRepository.getCurrentUser(
      options,
    )

    const tenant = SequelizeRepository.getCurrentTenant(
      options,
    )

    const transaction = SequelizeRepository.getTransaction(
      options,
    )

    let dataAgendada = new Date(data.dataAgendada)
    dataAgendada.setHours(dataAgendada.getHours(),
      dataAgendada.getMinutes(),
      0)

    let dataConsulta = new Date(data.dataConsulta)
    dataConsulta.setHours(dataConsulta.getHours(),
      dataConsulta.getMinutes(),
      0);

    data.dataAgendada = new Date(dataAgendada).toJSON();
    data.dataConsulta = new Date(dataConsulta).toJSON();

    if (data.recorrente == 'Sim') {
      let dataInicio = new Date(data.dataDe);
      let hora = new Date(data.horaInicio);
      dataInicio.setHours(hora.getHours(),
        hora.getMinutes(),
        0)

      let dataAte = new Date(data.dataAte)

      while (dataInicio <= dataAte) {
        let gravar = false
        if (
          dataInicio.getDay() == 0 &&
          data.Domingo == 'true'
        ) {
          gravar = true
        } else if (
          dataInicio.getDay() == 1 &&
          data.Segunda == 'true'
        ) {
          gravar = true
        } else if (
          dataInicio.getDay() == 2 &&
          data.Terça == 'true'
        ) {
          gravar = true
        } else if (
          dataInicio.getDay() == 3 &&
          data.Quarta == 'true'
        ) {
          gravar = true
        } else if (
          dataInicio.getDay() == 4 &&
          data.Quinta == 'true'
        ) {
          gravar = true
        } else if (
          dataInicio.getDay() == 5 &&
          data.Sexta == 'true'
        ) {
          gravar = true
        } else if (
          dataInicio.getDay() == 6 &&
          data.Sabado == 'true'
        ) {
          gravar = true
        }

        if (gravar == true) {
          let consulta = await this.validarConsultaRecorrente(data)
          if (consulta == true) {
            data.dataAgendada = dataInicio;

            const record = await options.database.agenda.create(
              {
                ...lodash.pick(data, [
                  'dataAgendada',
                  'dataConsulta',
                  'statusConsulta',
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

            await record.setNutricionista(
              data.nutricionista || null,
              {
                transaction,
              },
            )
            await record.setCliente(data.cliente || null, {
              transaction,
            })
            await record.setNotificacaoCliente(data.cliente || null, {
              transaction,
            })
            await record.setAvaliacao(data.avaliacao || null, {
              transaction,
            })

            await this._createAuditLog(
              AuditLogRepository.CREATE,
              record,
              data,
              options,
            )
          }
        }
        dataInicio.setDate(dataInicio.getDate() + 1)
      }
      return;
    }


    const record = await options.database.agenda.create(
      {
        ...lodash.pick(data, [
          'dataAgendada',
          'dataConsulta',
          'statusConsulta',
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

    await record.setNutricionista(
      data.nutricionista || null,
      {
        transaction,
      },
    )
    await record.setCliente(data.cliente || null, {
      transaction,
    })
    await record.setAvaliacao(data.avaliacao || null, {
      transaction,
    })

    await this._createAuditLog(
      AuditLogRepository.CREATE,
      record,
      data,
      options,
    )

    return this.findById(record.id, options)
  }

  /**
   * Updates the Agenda.
   *
   * @param {Object} data
   * @param {Object} [options]
   */
  static async update(
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

    let record = await options.database.agenda.findByPk(
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
          'dataAgendada',
          'dataConsulta',
          'statusConsulta',
          'importHash',
        ]),
        updatedById: currentUser.id,
      },
      {
        transaction,
      },
    )

    await record.setNutricionista(
      data.nutricionista || null,
      {
        transaction,
      },
    )
    await record.setCliente(data.cliente || null, {
      transaction,
    })
    await record.setAvaliacao(data.avaliacao || null, {
      transaction,
    })

    await this._createAuditLog(
      AuditLogRepository.UPDATE,
      record,
      data,
      options,
    )

    return this.findById(record.id, options)
  }

  static async updateAtendimento(
    id,
    data,
    options: IRepositoryOptions,
  ) {
    const transaction = SequelizeRepository.getTransaction(
      options,
    )

    let record = await options.database.agenda.findByPk(
      id,
      {
        transaction,
      },
    )

    await record.setCliente(data.cliente, {
      transaction,
    })

    return
  }

  /**
   * Deletes the Agenda.
   *
   * @param {string} id
   * @param {Object} [options]
   */
  static async destroy(id, options: IRepositoryOptions) {
    const transaction = SequelizeRepository.getTransaction(
      options,
    )

    let record = await options.database.agenda.findByPk(
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
   * Finds the Agenda and its relations.
   *
   * @param {string} id
   * @param {Object} [options]
   */
  static async findById(id, options: IRepositoryOptions) {
    const transaction = SequelizeRepository.getTransaction(
      options,
    )

    const include = [
      {
        model: options.database.user,
        as: 'nutricionista',
      },
      {
        model: options.database.cliente,
        as: 'cliente',
      },
      {
        model: options.database.avaliacao,
        as: 'avaliacao',
      },
    ]

    const record = await options.database.agenda.findByPk(
      id,
      {
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

  /**
   * Counts the number of Agendas based on the filter.
   *
   * @param {Object} filter
   * @param {Object} [options]
   */
  static async count(filter, options: IRepositoryOptions) {
    const transaction = SequelizeRepository.getTransaction(
      options,
    )

    const tenant = SequelizeRepository.getCurrentTenant(
      options,
    )

    return options.database.agenda.count(
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

  /**
   * Finds the Agendas based on the query.
   * See https://sequelize.org/v5/manual/querying.html to learn how to
   * customize the query.
   *
   * @param {Object} query
   * @param {Object} query.filter
   * @param {number} query.limit
   * @param  {number} query.offset
   * @param  {string} query.orderBy
   * @param {Object} [options]
   *
   * @returns {Promise<Object>} response - Object containing the rows and the count.
   */
  static async findAndCountAll(
    { filter, limit = 0, offset = 0, orderBy = '' },
    options: IRepositoryOptions,
  ) {
    const tenant = SequelizeRepository.getCurrentTenant(
      options,
    )

    let whereAnd: Array<any> = []
    let include = [
      {
        model: options.database.user,
        as: 'nutricionista',
      },
      {
        model: options.database.cliente,
        as: 'cliente',
      },
      {
        model: options.database.avaliacao,
        as: 'avaliacao',
      },
    ]

    whereAnd.push({
      tenantId: tenant.id,
    })

    const currentUser = SequelizeRepository.getCurrentUser(
      options,
    )
    if (currentUser.usuarioMaster != 'Sim') {
      if (currentUser.afiliadoId == null) {
        whereAnd.push({
          ['id']: currentUser.id,
        })
      } else {
        const transaction = SequelizeRepository.getTransaction(
          options,
        )
        let regiao = await options.database.user.findAll({
          where: {
            afiliadoId: currentUser.afiliadoId,
          },
          transaction,
        })

        var users = ''
        regiao.forEach((element) => {
          users += ';' + element.id + ';'
        })

        var usersValidado: string[] = []
        users.split(';').forEach((element) => {
          if (element != '') {
            usersValidado.push(element)
          }
        })

        const Op = Sequelize.Op
        whereAnd.push({
          nutricionistaId: {
            [Op.in]: usersValidado,
          },
        })
      }
    }

    if (filter) {
      if (filter.id) {
        whereAnd.push({
          ['id']: SequelizeFilterUtils.uuid(filter.id),
        })
      }

      if (filter.nutricionista) {
        whereAnd.push({
          ['nutricionistaId']: SequelizeFilterUtils.uuid(
            filter.nutricionista,
          ),
        })
      }

      if (filter.cliente) {
        whereAnd.push({
          ['clienteId']: SequelizeFilterUtils.uuid(
            filter.cliente,
          ),
        })
      }

      if (filter.dataAgendadaRange) {
        const [start, end] = filter.dataAgendadaRange

        if (
          start !== undefined &&
          start !== null &&
          start !== ''
        ) {
          whereAnd.push({
            dataAgendada: {
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
            dataAgendada: {
              [Op.lte]: end,
            },
          })
        }
      }

      if (filter.dataConsultaRange) {
        const [start, end] = filter.dataConsultaRange

        if (
          start !== undefined &&
          start !== null &&
          start !== ''
        ) {
          whereAnd.push({
            dataConsulta: {
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
            dataConsulta: {
              [Op.lte]: end,
            },
          })
        }
      }

      if (filter.statusConsulta) {
        whereAnd.push({
          statusConsulta: filter.statusConsulta,
        })
      }

      if (filter.avaliacao) {
        whereAnd.push({
          ['avaliacaoId']: SequelizeFilterUtils.uuid(
            filter.avaliacao,
          ),
        })
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
    } = await options.database.agenda.findAndCountAll({
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

  static async findAgendamentosDisponiveis(
    idCliente,
    options: IRepositoryOptions,
  ) {
    let cliente = await options.database.cliente.findAll({
      where: {
        id: idCliente,
      },
    })

    let bairro = ''
    let cidade = ''
    let uf = ''

    cliente.forEach((element) => {
      let clientes: any[] = Object.entries(element)
      bairro = clientes[0][1]['bairro']
      cidade = clientes[0][1]['cidade']
      uf = clientes[0][1]['uf']
    })

    let regiao = await options.database.regiao.findAll({
      where: {
        descricao: { [Op.like]: `%${bairro}%` },
        cidade: cidade,
        uf: uf,
      },
    })

    let idAfiliado = ''

    regiao.forEach((element) => {
      let regioes: any[] = Object.entries(element)
      idAfiliado = regioes[0][1]['afiliadoId']
    })

    let nutricionistas = await options.database.user.findAll(
      {
        where: {
          afiliadoId: idAfiliado,
        },
      },
    )

    nutricionistas = Object.entries(nutricionistas)
    nutricionistas = nutricionistas

    let idsNutricionistas: any[] = []
    nutricionistas.forEach((nutricionista: any[]) => {
      let idNutricionista: any[] =
        nutricionista[1]['dataValues']['id']
      idsNutricionistas.push(idNutricionista)
    })

    let dataAtual = new Date()
    dataAtual.toJSON()

    let include = [
      {
        model: options.database.user,
        as: 'nutricionista',
        include: {
          model: options.database.file,
          as: { singular: 'avatar', plural: 'avatars' },
        },
      },
    ]

    let agenda = await options.database.agenda.findAll({
      where: {
        nutricionistaId: { [Op.in]: idsNutricionistas },
        clienteId: { [Op.is]: null },
        dataAgendada: { [Op.gte]: dataAtual },
        statusConsulta: 'Aguardando_Confirmação',
      },
      include,
      //group: 'nutricionistaId',
      order: [
        ['nutricionistaId', 'ASC'],
        ['dataAgendada', 'ASC'],
      ],
    })

    agenda = Object.entries(agenda)
    agenda = agenda

    let agendamentosMarcados: any[] = []
    agenda.forEach((arrayAgendamento: any[]) => {
      let agendamento: any[] =
        arrayAgendamento[1]['dataValues']
      agendamentosMarcados.push(agendamento)
    })

    return agendamentosMarcados
  }

  static async findAgendamentosMarcados(
    idCliente,
    options: IRepositoryOptions,
  ) {
    let cliente = await options.database.cliente.findAll({
      where: {
        id: idCliente,
      },
    })

    let bairro = ''
    let cidade = ''
    let uf = ''

    cliente.forEach((element) => {
      let clientes: any[] = Object.entries(element)
      bairro = clientes[0][1]['bairro']
      cidade = clientes[0][1]['cidade']
      uf = clientes[0][1]['uf']
    })

    let regiao = await options.database.regiao.findAll({
      where: {
        descricao: { [Op.like]: `%${bairro}%` },
        cidade: cidade,
        uf: uf,
      },
    })

    let idAfiliado = ''

    regiao.forEach((element) => {
      let regioes: any[] = Object.entries(element)
      idAfiliado = regioes[0][1]['afiliadoId']
    })

    let nutricionistas = await options.database.user.findAll(
      {
        where: {
          afiliadoId: idAfiliado,
        },
      },
    )

    nutricionistas = Object.entries(nutricionistas)
    nutricionistas = nutricionistas

    let idsNutricionistas: any[] = []
    nutricionistas.forEach((nutricionista: any[]) => {
      let idNutricionista: any[] =
        nutricionista[1]['dataValues']['id']
      // idsNutricionista = nutricionista['user']['dataValues']['id']
      idsNutricionistas.push(idNutricionista)
    })

    let dataAtual = new Date()
    dataAtual = new Date(
      dataAtual.getFullYear(),
      dataAtual.getMonth(),
      dataAtual.getDate(),
    )

    let include = [
      {
        model: options.database.user,
        as: 'nutricionista',
        include: [
          {
            model: options.database.file,
            as: { singular: 'avatar', plural: 'avatars' },
          },
          {
            model: options.database.afiliados,
            as: 'afiliado',
          },
        ],
      },
    ]

    let agenda = await options.database.agenda.findAll({
      where: {
        nutricionistaId: { [Op.in]: idsNutricionistas },
        clienteId: { [Op.eq]: idCliente },
        dataAgendada: { [Op.gte]: dataAtual },
        statusConsulta: {
          [Op.in]: ['Aguardando_Confirmação', 'Confirmada'],
        },
      },
      include,
      order: [
        ['nutricionistaId', 'ASC'],
        ['dataAgendada', 'ASC'],
      ],
    })

    agenda = Object.entries(agenda)
    agenda = agenda

    let agendamentosMarcados: any[] = []
    agenda.forEach((arrayAgendamento: any[]) => {
      let agendamento: any[] =
        arrayAgendamento[1]['dataValues']
      agendamentosMarcados.push(agendamento)
    })

    let agendamentosDisponiveis = await this.findAgendamentosDisponiveis(
      idCliente,
      options,
    )

    let objAgendamentos = {
      disponiveis: agendamentosDisponiveis,
      marcados: agendamentosMarcados,
    }

    return objAgendamentos
  }

  static async findAll(res, options: IRepositoryOptions) {
    let offset = 0
    let orderBy = ''

    let whereAnd: Array<any> = []
    let include = [
      {
        model: options.database.user,
        as: 'nutricionista',
      },
      {
        model: options.database.cliente,
        as: 'cliente',
      },
      {
        model: options.database.avaliacao,
        as: 'avaliacao',
      },
    ]

    const currentUser = SequelizeRepository.getCurrentUser(
      options,
    )
    whereAnd.push({ nutricionistaId: currentUser.id })

    const where = { [Op.and]: whereAnd }

    let {
      rows,
    } = await options.database.agenda.findAndCountAll({
      where,
      include,
      offset: offset ? Number(offset) : undefined,
      order: orderBy
        ? [orderBy.split('_')]
        : [['dataAgendada', 'ASC']],
      transaction: SequelizeRepository.getTransaction(
        options,
      ),
    })

    let calendario: any[] = []

    rows.forEach((i) => {
      let inicio
      let color
      let nome

      if (i.cliente != null) {
        nome = i.cliente.nome
      } else {
        nome = 'Sem cliente'
      }

      if (i.dataConsulta != null) {
        inicio = i.dataConsulta
      } else {
        inicio = i.dataAgendada
      }

      if (i.statusConsulta == 'Aguardando_Confirmação') {
        if (nome == 'Sem cliente') {
          color = '#000000'
        } else {
          color = '#ab071d'
        }
      }

      if (i.statusConsulta == 'Confirmada') {
        color = '#3cb362'
      }

      if (i.statusConsulta == 'Recusada') {
        color = '#009688'
      }

      if (i.statusConsulta == 'Concluída') {
        color = '#ff5722'
      }

      if (i.statusConsulta == 'Cancelada') {
        color = '#ffd600'
      }

      if (i.statusConsulta == 'Remarcada') {
        color = '#424242'
      }

      calendario.push({
        id: i.id,
        title: i.nutricionista.firstName,
        start: inicio,
        description: nome,
        color: color,
        status: i.statusConsulta,
      })
    })

    rows = await this._fillWithRelationsAndFilesForRows(
      rows,
      options,
    )

    if (calendario.length == 0) {
      return res
        .status(401)
        .send({ mensagem: 'não autorizado' })
    }

    return { calendario }
  }

  /**
   * Lists the Agendas to populate the autocomplete.
   * See https://sequelize.org/v5/manual/querying.html to learn how to
   * customize the query.
   *
   * @param {Object} query
   * @param {number} limit
   */
  static async findAllAutocomplete(
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

    if (query) {
      where = {
        ...where,
        [Op.or]: [
          { ['id']: SequelizeFilterUtils.uuid(query) },
        ],
      }
    }

    const currentUser = SequelizeRepository.getCurrentUser(
      options,
    )
    if (currentUser.usuarioMaster != 'Sim') {
      if (currentUser.afiliadoId == null) {
        where = {
          ['id']: currentUser.id,
        }
      } else {
        const transaction = SequelizeRepository.getTransaction(
          options,
        )
        let regiao = await options.database.user.findAll({
          where: {
            afiliadoId: currentUser.afiliadoId,
          },
          transaction,
        })

        var users = ''
        regiao.forEach((element) => {
          users += ';' + element.id + ';'
        })

        var usersValidado: string[] = []
        users.split(';').forEach((element) => {
          if (element != '') {
            usersValidado.push(element)
          }
        })

        const Op = Sequelize.Op
        where = {
          nutricionistaId: {
            [Op.in]: usersValidado,
          },
        }
      }
    }

    const records = await options.database.agenda.findAll({
      attributes: ['id', 'id'],
      where,
      limit: limit ? Number(limit) : undefined,
      orderBy: [['id', 'ASC']],
    })

    return records.map((record) => ({
      id: record.id,
      label: record.id,
    }))
  }

  /**
   * Creates an audit log of the operation.
   *
   * @param {string} action - The action [create, update or delete].
   * @param {object} record - The sequelize record
   * @param {object} data - The new data passed on the request
   * @param {object} options
   */
  static async _createAuditLog(
    action,
    record,
    data,
    options: IRepositoryOptions,
  ) {
    let values = {}

    if (data) {
      values = {
        ...record.get({ plain: true }),
      }
    }

    await AuditLogRepository.log(
      {
        entityName: 'agenda',
        entityId: record.id,
        action,
        values,
      },
      options,
    )
  }

  /**
   * Fills an array of Agenda with relations and files.
   *
   * @param {Array} rows
   * @param {Object} [options]
   */
  static async _fillWithRelationsAndFilesForRows(
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
   * Fill the Agenda with the relations and files.
   *
   * @param {Object} record
   * @param {Object} [options]
   */
  static async _fillWithRelationsAndFiles(
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

    return output
  }

  static async validarConsulta(
    params
  ) {
    let dataAgendadaEditAntes = new Date(params.dataAgendada)
    let dataAgendadaEditDepois = new Date(params.dataAgendada)
    let minuto = dataAgendadaEditAntes.getMinutes();


    let minutoAntes = minuto - 59;
    let minutoDepois = minuto + 59;

    let dataAgendadaAntes = new Date(
      dataAgendadaEditAntes.setHours(dataAgendadaEditAntes.getHours(), minutoAntes, 0))


    let dataAgendadaDepois = new Date(
      dataAgendadaEditDepois.setHours(dataAgendadaEditDepois.getHours(), minutoDepois, 0))

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

    let query =
      'SELECT * FROM agendas ' +
      "where (nutricionistaId = '" +
      params.nutricionista +
      "' OR clienteId = '" +
      params.cliente +
      "') " +
      ' AND  deletedat IS NULL  ' +
      "AND (dataagendada BETWEEN '" +
      dataAgendadaAntes.toJSON() +
      "' AND '" +
      params.dataAgendada +
      "' " +
      "OR dataagendada BETWEEN '" +
      params.dataAgendada +
      "' AND '" +
      dataAgendadaDepois.toJSON() +
      "' )" +
      "AND (id <> '" +
      params.id +
      "' " +
      "OR '" +
      params.id +
      "' = '0')"

    const consultasAtuais = await seq.query(query, {
      type: QueryTypes.SELECT,
    })

    return consultasAtuais

  }

  static async validarConsultaRecorrente(
    params
  ) {
    let dataAgendadaEditAntes = new Date(params.dataAgendada)
    let dataAgendadaEditDepois = new Date(params.dataAgendada)
    let minuto = dataAgendadaEditAntes.getMinutes();


    let minutoAntes = minuto - 59;
    let minutoDepois = minuto + 59;

    let dataAgendadaAntes = new Date(
      dataAgendadaEditAntes.setHours(dataAgendadaEditAntes.getHours(), minutoAntes, 0))


    let dataAgendadaDepois = new Date(
      dataAgendadaEditDepois.setHours(dataAgendadaEditDepois.getHours(), minutoDepois, 0))

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

    let query =
      'SELECT * FROM agendas ' +
      "where (nutricionistaId = '" +
      params.nutricionista +
      "' OR clienteId = '" +
      params.cliente +
      "') " +
      ' AND  deletedat IS NULL  ' +
      "AND (dataagendada BETWEEN '" +
      dataAgendadaAntes.toJSON() +
      "' AND '" +
      params.dataAgendada +
      "' " +
      "OR dataagendada BETWEEN '" +
      params.dataAgendada +
      "' AND '" +
      dataAgendadaDepois.toJSON() +
      "' )" +
      "AND (id <> '" +
      params.id +
      "' " +
      "OR '" +
      params.id +
      "' = '0')"

    const consultasAtuais = await seq.query(query, {
      type: QueryTypes.SELECT,
    })


    if (consultasAtuais.length == 0) {
      return true;
    } else {
      return false;
    }

  }
}

export default AgendaRepository
