import SequelizeRepository from '../../database/repositories/sequelizeRepository'
import AuditLogRepository from '../../database/repositories/auditLogRepository'
import lodash from 'lodash'
import SequelizeFilterUtils from '../../database/utils/sequelizeFilterUtils'
import Error404 from '../../errors/Error404'
import Sequelize from 'sequelize'
import { IRepositoryOptions } from './IRepositoryOptions'
import { getConfig } from '../../config'

const highlight = require('cli-highlight').highlight
const Op = Sequelize.Op

/**
 * Handles database operations for the ProgramaAtividadeItem.
 * See https://sequelize.org/v5/index.html to learn how to customize it.
 */
class ProgramaAtividadeItemRepository {
  /**
   * Creates the ProgramaAtividadeItem.
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

    const record = await options.database.programaAtividadeItem.create(
      {
        ...lodash.pick(data, [
          'item',
          'pontos',
          'dia',
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

    await record.setCliente(data.cliente || [], {
      transaction,
    })

    await record.setProgramaAtividade(
      data.programaAtividade || null,
      {
        transaction,
      },
    )

    await this._createAuditLog(
      AuditLogRepository.CREATE,
      record,
      data,
      options,
    )

    return this.findById(record.id, options)
  }

  /**
   * Updates the ProgramaAtividadeItem.
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

    let record = await options.database.programaAtividadeItem.findByPk(
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
          'item',
          'pontos',
          'dia',
          'importHash',
        ]),
        updatedById: currentUser.id,
      },
      {
        transaction,
      },
    )

    await record.setCliente(data.cliente || [], {
      transaction,
    })

    await record.setProgramaAtividade(
      data.programaAtividade || null,
      {
        transaction,
      },
    )

    await this._createAuditLog(
      AuditLogRepository.UPDATE,
      record,
      data,
      options,
    )

    return this.findById(record.id, options)
  }

  static async setClienteProgramaItem (data)  {
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

    let message = {}
    let verificarProgramaCliente = await seq
      .query(
        'SELECT * ' +
          'FROM programaatividadeitemclientecliente ' +
          "WHERE programaAtividadeItemId = '" +
          data.programaAtividadeItemId +
          "' " +
          "AND clienteId = '" +
          data.id +
          "'",
        { type: QueryTypes.SELECT },
      )
      .then(async (result) => {
        if (result.length == 0) {
          let setarCliente = await seq.query(
            'INSERT INTO programaAtividadeItemClienteCliente ' +
              '(createdAt, updatedAt, programaAtividadeItemId, clienteId) ' +
              'VALUES ' +
              "(now(), now(), '" +
              data.programaAtividadeItemId +
              "', '" +
              data.id +
              "')",
            { type: QueryTypes.INSERT },
          )
          
          message =  {
            message: 'Atividade concluída com sucesso!',
          }
        } else {
          message = { message: 'Atividade já foi concluída!' }
        }
      })

      return message
  }

  /**
   * Deletes the ProgramaAtividadeItem.
   *
   * @param {string} id
   * @param {Object} [options]
   */
  static async destroy (id, options: IRepositoryOptions) {
    const transaction = SequelizeRepository.getTransaction(
      options,
    )

    let record = await options.database.programaAtividadeItem.findByPk(
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
   * Finds the ProgramaAtividadeItem and its relations.
   *
   * @param {string} id
   * @param {Object} [options]
   */
  static async findById (id, options: IRepositoryOptions) {
    const transaction = SequelizeRepository.getTransaction(
      options,
    )

    const include = []

    const record = await options.database.programaAtividadeItem.findByPk(
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
   * Counts the number of ProgramaAtividadeItems based on the filter.
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

    return options.database.programaAtividadeItem.count(
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
   * Finds the ProgramaAtividadeItems based on the query.
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

  static async listAtividades (
    args,
    options: IRepositoryOptions,
  ) {
    let idCliente = args.params.id

    let whereAnd: Array<any> = []
    let include = [
      {
        model: options.database.programaAtividade,
        as: 'programaAtividade',
        include: {
          model: options.database.file,
          as: 'imagem',
        },
      },
      {
        model: options.database.cliente,
        as: 'cliente',
        where: {
          id: idCliente,
        },
      },
    ]

    let includeDisponiveis = [
      {
        model: options.database.programaAtividade,
        as: 'programaAtividade',
        include: {
          model: options.database.file,
          as: 'imagem',
        },
      },
    ]

    /* whereAnd.push({
      ['id']: SequelizeFilterUtils.uuid(filter.id),
    }); */

    const where = { [Op.and]: whereAnd }

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

    let arrayPontos = new Array()
    arrayPontos = await seq.query(
      'SELECT DISTINCT Sum(( CASE ' +
        'WHEN c.clienteid IS NULL THEN 0  ' +
        'ELSE a.pontos  ' +
        'end )) AS pontos_ganhos,  ' +
        'Sum(( CASE  ' +
        'WHEN c.clienteid IS NULL THEN 0  ' +
        'ELSE ( CASE  ' +
        'WHEN Date_add(Date(d.createdat),  ' +
        'INTERVAL a.dia - 1 day) =  ' +
        'Date(Now()) THEN  ' +
        'a.pontos  ' +
        'ELSE 0  ' +
        'end )  ' +
        'end )) AS pontos_ganhos_hoje  ' +
        'FROM   `programaatividadeitems` a  ' +
        'JOIN programaatividades b  ' +
        'ON a.programaatividadeid = b.id  ' +
        'LEFT JOIN programaatividadeitemclientecliente c  ' +
        'ON a.id = c.programaatividadeitemid  ' +
        " AND c.clienteid = '" +
        idCliente +
        "' " +
        ' JOIN programaatividadecliente d ' +
        "ON d.clienteid = '" +
        idCliente +
        "' " +
        'AND d.programaatividadeid = b.id  ' +
        'LEFT JOIN files e  ' +
        'ON e.belongstoid = b.id  ' +
        " AND belongsto = 'programaAtividades'  " +
        'WHERE  a.deletedat IS NULL  ' +
        'AND b.deletedat IS NULL  ' +
        'AND Date_add(Date(d.createdat), INTERVAL a.dia - 1 day) <= Date(Now()) ',
      { type: QueryTypes.SELECT },
    )

    let pontosTotais = ''
    let pontosDia = ''

    if (arrayPontos.length > 0) {
      pontosTotais = arrayPontos[0].pontos_ganhos
      pontosDia = arrayPontos[0].pontos_ganhos_hoje
    }

    let arrayGeral = new Array()
    arrayGeral = await seq.query(
      "SELECT distinct b.nome as 'programa', a.id, a.dia, a.item, (CASE WHEN c.clienteId is null THEN 0 ELSE 1 END) as respondido, " +
        ' a.pontos, e.privateUrl as imagem,   ' +
        'CASE WHEN DATE_ADD(DATE(d.createdAt), INTERVAL a.dia - 1 DAY) = DATE(NOW()) THEN 1 ELSE 0 END ativo ' +
        'FROM `programaatividadeitems` a ' +
        'join programaatividades b on a.programaAtividadeId = b.id ' +
        'left join programaatividadeitemclientecliente c ON a.id = c.programaAtividadeItemId ' +
        "AND c.clienteId = '" +
        idCliente +
        "' " +
        "join programaatividadecliente d ON d.clienteId = '" +
        idCliente +
        "' AND d.programaAtividadeId = b.id " +
        "left join files e ON e.belongsToId = b.id AND belongsTo = 'programaAtividades' " +
        'WHERE a.deletedAt is null and b.deletedAt is null ' +
        'AND DATE_ADD(DATE(d.createdAt), INTERVAL a.dia - 1 DAY) <= DATE(NOW()) ' +
        'ORDER by dia desc, respondido asc, ativo asc',
      { type: QueryTypes.SELECT },
    )

    let arrayAtividades = new Array()
    let arraySecundario = arrayGeral
    let dia = ''
    let dados = new Array()
    arrayGeral.forEach((atividade) => {
      if (dia != atividade['dia']) {
        dia = atividade['dia']

        arraySecundario.forEach((dadosAtividades) => {
          if (dia == dadosAtividades['dia']) {
            dados.push(dadosAtividades)
          }
        })

        arrayAtividades.push({
          dia: atividade['dia'],
          atividades: dados,
        })

        dados = []
      }
    })

    let atividades = arrayAtividades

    return { pontosTotais, pontosDia, atividades }
  }

  static async findAndCountAll (
    { filter, limit = 0, offset = 0, orderBy = '' },
    options: IRepositoryOptions,
  ) {
    const tenant = SequelizeRepository.getCurrentTenant(
      options,
    )

    let whereAnd: Array<any> = []
    let include = [
      {
        model: options.database.programaAtividade,
        as: 'programaAtividade',
      },
    ]

    whereAnd.push({
      tenantId: tenant.id,
    })

    if (filter) {
      if (filter.id) {
        whereAnd.push({
          ['id']: SequelizeFilterUtils.uuid(filter.id),
        })
      }

      if (filter.item) {
        whereAnd.push(
          SequelizeFilterUtils.ilike(
            'programaAtividadeItem',
            'item',
            filter.item,
          ),
        )
      }

      if (filter.programaAtividade) {
        whereAnd.push(
          SequelizeFilterUtils.ilike(
            'programaAtividadeItem',
            'programaAtividadeId',
            filter.programaAtividade,
          ),
        )
      }

      if (filter.pontosRange) {
        const [start, end] = filter.pontosRange

        if (
          start !== undefined &&
          start !== null &&
          start !== ''
        ) {
          whereAnd.push({
            pontos: {
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
            pontos: {
              [Op.lte]: end,
            },
          })
        }
      }

      if (filter.diaRange) {
        const [start, end] = filter.diaRange

        if (
          start !== undefined &&
          start !== null &&
          start !== ''
        ) {
          whereAnd.push({
            dia: {
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
            dia: {
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
    } = await options.database.programaAtividadeItem.findAndCountAll(
      {
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
      },
    )

    rows = await this._fillWithRelationsAndFilesForRows(
      rows,
      options,
    )

    return { rows, count }
  }

  /**
   * Lists the ProgramaAtividadeItems to populate the autocomplete.
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
              'programaAtividadeItem',
              'item',
              query,
            ),
          },
        ],
      }
    }

    const records = await options.database.programaAtividadeItem.findAll(
      {
        attributes: ['id', 'item'],
        where,
        limit: limit ? Number(limit) : undefined,
        orderBy: [['item', 'ASC']],
      },
    )

    return records.map((record) => ({
      id: record.id,
      label: record.item,
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
        clienteIds: data.cliente,
      }
    }

    await AuditLogRepository.log(
      {
        entityName: 'programaAtividadeItem',
        entityId: record.id,
        action,
        values,
      },
      options,
    )
  }

  /**
   * Fills an array of ProgramaAtividadeItem with relations and files.
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
   * Fill the ProgramaAtividadeItem with the relations and files.
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

    output.cliente = await record.getCliente({
      transaction,
    })

    return output
  }
}

export default ProgramaAtividadeItemRepository
