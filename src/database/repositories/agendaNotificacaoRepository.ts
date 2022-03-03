import SequelizeRepository from '../../database/repositories/sequelizeRepository'
import AuditLogRepository from '../../database/repositories/auditLogRepository'
import lodash from 'lodash'
import SequelizeFilterUtils from '../../database/utils/sequelizeFilterUtils'
import Error404 from '../../errors/Error404'
import Sequelize from 'sequelize'
import { IRepositoryOptions } from './IRepositoryOptions'
import { getConfig } from '../../config'
import moment from 'moment'

const highlight = require('cli-highlight').highlight

const Op = Sequelize.Op

/**
 * Handles database operations for the AgendaNotificacao.
 * See https://sequelize.org/v5/index.html to learn how to customize it.
 */
class AgendaNotificacaoRepository {
  /**
   * Creates the AgendaNotificacao.
   *
   * @param {Object} data
   * @param {Object} [options]
   */
  static async create (data, options: IRepositoryOptions) {
    const transaction = SequelizeRepository.getTransaction(
      options,
    )

    const record = await options.database.agendaNotificacao.create(
      {
        ...lodash.pick(data, ['token', 'dataEnvio']),
      },
      {
        transaction,
      },
    )

    await record.setCliente(data.cliente || null, {
      transaction,
    })

    return this.findById(record.id, options)
  }

  /**
   * Updates the AgendaNotificacao.
   *
   * @param {Object} data
   * @param {Object} [options]
   */
  
  static async updateNotificacao (
    params,
    data,
    options: IRepositoryOptions,
  ) {
    const transaction = SequelizeRepository.getTransaction(
      options,
    )

    let record = await options.database.agendaNotificacao.findByPk(
      params.idAgendaNotificacao,
      {
        transaction,
      },
    )

    record = await record.update(
      {
        ...lodash.pick(data, ['dataEnvio']),
      },
      {
        transaction,
      },
    )

    await record.setCliente(data.cliente || null, {
      transaction,
    })

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

    let setarCliente = await seq.query(
      "UPDATE notificacaos " +
      "SET enviado = 'Sim' " +
      "WHERE id = '"+params.idNotificacao+"'",
      { type: QueryTypes.UPDATE },
    )

    return 'OK'
  }

   static async update (
    id,
    data,
    options: IRepositoryOptions,
  ) {
    const transaction = SequelizeRepository.getTransaction(
      options,
    )

    let record = await options.database.agendaNotificacao.findByPk(
      id,
      {
        transaction,
      },
    )

    record = await record.update(
      {
        ...lodash.pick(data),
      },
      {
        transaction,
      },
    )

    await record.setCliente(data.cliente || null, {
      transaction,
    })

    return 'OK'
  }

  static async findByToken (
    params,
    options: IRepositoryOptions,
  ) {
    const transaction = SequelizeRepository.getTransaction(
      options,
    )

    const include = []

    const record = await options.database.agendaNotificacao.findAll(
      {
        where: {
          token: params.id,
        },
      },
      {
        transaction,
      },
    )
    if (record.length > 0) {
      let clientes = new Array()
      clientes = Object.entries(record[0])
      let idToken = clientes[0][1]['id']
      let idCliente = clientes[0][1]['clienteId']

      if (idCliente == params.cliente) {
        return { record, message: 'ok' }
      } else {
        return {
          record,
          message: 'atualizar',
          idCliente,
          idToken,
        }
      }
    } else {
      return { record, message: 'cadastrar' }
    }
  }

  /**
   * Deletes the AgendaNotificacao.
   *
   * @param {string} id
   * @param {Object} [options]
   */
  static async destroy (id, options: IRepositoryOptions) {
    const transaction = SequelizeRepository.getTransaction(
      options,
    )

    let record = await options.database.agendaNotificacao.findByPk(
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
   * Finds the AgendaNotificacao and its relations.
   *
   * @param {string} id
   * @param {Object} [options]
   */

  static async findNotificacoesAgenda(options: IRepositoryOptions){
    const { QueryTypes } = require('sequelize');
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
    );

    const transaction = SequelizeRepository.getTransaction(
      options,
    )

    const format1 = "YYYY-MM-DD HH:mm:ss";
    let hoje = moment().subtract('days').format(format1);
    let amanha = moment().add(1, 'days').format(format1);
    
    let query = `SELECT agenda.id as id, DATE_FORMAT(agenda.dataAgendada, '%d/%m/%Y %H:%i') as dataAgendada, cliente.nome as nome, notificacaoCliente.token as token, cliente.id as clienteId FROM agendas AS agenda
    LEFT OUTER JOIN clientes AS cliente ON agenda.clienteId = cliente.id AND (cliente.deletedAt IS NULL) 
    LEFT OUTER JOIN notificacaoClientes AS notificacaoCliente ON agenda.notificacaoClienteId = notificacaoCliente.clienteId 
    WHERE (agenda.deletedAt IS NULL 
    AND (agenda.statusConsulta = 'Confirmada'
    AND agenda.notificacao = false 
    AND agenda.dataAgendada >= '${hoje}' 
    AND agenda.dataAgendada <= '${amanha}'));`

    const record = await seq.query(query, {
      type: QueryTypes.SELECT,
    })

    // const record = await options.database.agenda.findAll(
    //   {
    //     where: {
    //       [Op.and]: [
    //         { statusConsulta: 'Confirmada' },
    //         { notificacao: false },
    //         { dataAgendada: {[Op.gte]: moment().subtract('days').toDate()}},
    //         { dataAgendada: {[Op.lte]: moment().add(1, 'days').toDate()}}
    //       ]
    //     },
    //     include: [
    //       {
    //         model: options.database.cliente,
    //         as: 'cliente',
    //       },
    //       {
    //         model: options.database.notificacaoCliente,
    //         as: 'notificacaoCliente',      
    //         key: 'clienteId'
    //       },
    //     ]
    //   },
    //   {
    //     transaction,
    //   },
    // )

    if(record.length != 0){
      record.forEach(async element => {  
        let finalizarNotificacao = await seq.query(
          `
            UPDATE souleve.agendas
            SET notificacao = 1
            WHERE id = '${element.id}';
          `,
          { type: QueryTypes.UPDATE },
        );
      });
    }
    return record
  }

  static async findById (id, options: IRepositoryOptions) {
    const transaction = SequelizeRepository.getTransaction(
      options,
    )

    const include = []

    const record = await options.database.agendaNotificacao.findByPk(
      id,
      {
        include,
        transaction,
      },
    )

    return this._fillWithRelationsAndFiles(record, options)
  }

  /**
   * Counts the number of AgendaNotificacaos based on the filter.
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

    return options.database.agendaNotificacao.count(
      {
        where: {
          ...filter,
        },
      },
      {
        transaction,
      },
    )
  }

  /**
   * Finds the AgendaNotificacaos based on the query.
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
  static async findAndCountAll (
    { filter, limit = 0, offset = 0, orderBy = '' },
    options: IRepositoryOptions,
  ) {
    let whereAnd: Array<any> = []
    let include = [
      {
        model: options.database.cliente,
        as: 'cliente',
      },
    ]

    if (filter) {
      if (filter.id) {
        whereAnd.push({
          ['id']: SequelizeFilterUtils.uuid(filter.id),
        })
      }

      if (filter.nome) {
        whereAnd.push(
          SequelizeFilterUtils.ilike(
            'token',
            'dataEnvio',
            filter.nome,
          ),
        )
      }

      if (filter.dataRange) {
        const [start, end] = filter.dataRange

        if (
          start !== undefined &&
          start !== null &&
          start !== ''
        ) {
          whereAnd.push({
            data: {
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
            data: {
              [Op.lte]: end,
            },
          })
        }
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
    } = await options.database.agendaNotificacao.findAndCountAll(
      {
        where,
        include,
        limit: limit ? Number(limit) : undefined,
        offset: offset ? Number(offset) : undefined,
        transaction: SequelizeRepository.getTransaction(
          options,
        ),
      },
    )

    rows = await this._fillWithRelationsAndFilesForRows(
      rows,
      options,
    )

    return { rows, count }
  }

  static async findAll (
    idTenant,
    res,
    options: IRepositoryOptions,
  ) {
    let offset = 0
    let orderBy = ''

    const tenant = SequelizeRepository.getCurrentTenant(
      options,
    )

    let whereAnd: Array<any> = []

    let {
      rows,
    } = await options.database.agendaNotificacao.findAndCountAll(
      {
        // where,
        offset: offset ? Number(offset) : undefined,
        transaction: SequelizeRepository.getTransaction(
          options,
        ),
      },
    )

    let calendario: any[] = []

    rows.forEach((i) => {
      calendario.push({
        id: i.id,
        title: i.nome,
        start: i.data,
        description: i.AgendaNotificacao,
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
   * Lists the AgendaNotificacaos to populate the autocomplete.
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

    if (query) {
      where = {
        ...where,
        [Op.or]: [
          { ['id']: SequelizeFilterUtils.uuid(query) },
          {
            [Op.and]: SequelizeFilterUtils.ilike(
              'AgendaNotificacao',
              'nome',
              query,
            ),
          },
        ],
      }
    }

    const records = await options.database.agendaNotificacao.findAll(
      {
        attributes: ['id', 'nome'],
        where,
        limit: limit ? Number(limit) : undefined,
      },
    )

    return records.map((record) => ({
      id: record.id,
      label: record.nome,
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
      }
    }

    await AuditLogRepository.log(
      {
        entityName: 'AgendaNotificacao',
        entityId: record.id,
        action,
        values,
      },
      options,
    )
  }

  /**
   * Fills an array of AgendaNotificacao with relations and files.
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
   * Fill the AgendaNotificacao with the relations and files.
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

    return output
  }
}

export default AgendaNotificacaoRepository
