import SequelizeRepository from '../../database/repositories/sequelizeRepository'
import AuditLogRepository from '../../database/repositories/auditLogRepository'
import lodash from 'lodash'
import SequelizeFilterUtils from '../../database/utils/sequelizeFilterUtils'
import Error404 from '../../errors/Error404'
import Sequelize from 'sequelize'
import FileRepository from './fileRepository'
import { IRepositoryOptions } from './IRepositoryOptions'
import programaCliente from '../models/programaCliente'
import moment from 'moment'

const Op = Sequelize.Op

/**
 * Handles database operations for the PilulaSouLeve.
 * See https://sequelize.org/v5/index.html to learn how to customize it.
 */
class PilulaSouLeveRepository {
  /**
   * Creates the PilulaSouLeve.
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

    const record = await options.database.pilulaSouLeve.create(
      {
        ...lodash.pick(data, [
          'nome',
          'dia',
          'frase',
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

    await record.setPrograma(data.programa || null, {
      transaction,
    })

    await FileRepository.replaceRelationFiles(
      {
        belongsTo: options.database.pilulaSouLeve.getTableName(),
        belongsToColumn: 'audio',
        belongsToId: record.id,
      },
      data.audio,
      options,
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
   * Updates the PilulaSouLeve.
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

    let record = await options.database.pilulaSouLeve.findByPk(
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
          'nome',
          'dia',
          'frase',
          'importHash',
        ]),
        updatedById: currentUser.id,
      },
      {
        transaction,
      },
    )

    await record.setPrograma(data.programa || null, {
      transaction,
    })

    await FileRepository.replaceRelationFiles(
      {
        belongsTo: options.database.pilulaSouLeve.getTableName(),
        belongsToColumn: 'audio',
        belongsToId: record.id,
      },
      data.audio,
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
   * Deletes the PilulaSouLeve.
   *
   * @param {string} id
   * @param {Object} [options]
   */
  static async destroy (id, options: IRepositoryOptions) {
    const transaction = SequelizeRepository.getTransaction(
      options,
    )

    let record = await options.database.pilulaSouLeve.findByPk(
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
   * Finds the PilulaSouLeve and its relations.
   *
   * @param {string} id
   * @param {Object} [options]
   */
  static async findById (id, options: IRepositoryOptions) {
    const transaction = SequelizeRepository.getTransaction(
      options,
    )

    const include = [
      {
        model: options.database.programa,
        as: 'programa',
      },
    ]

    const record = await options.database.pilulaSouLeve.findByPk(
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
   * Counts the number of PilulaSouLeves based on the filter.
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

    return options.database.pilulaSouLeve.count(
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
   * Finds the PilulaSouLeves based on the query.
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
    const tenant = SequelizeRepository.getCurrentTenant(
      options,
    )

    let whereAnd: Array<any> = []
    let include = [
      {
        model: options.database.programa,
        as: 'programa',
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

      if (filter.programa) {
        whereAnd.push({
          ['programaId']: SequelizeFilterUtils.uuid(
            filter.programa,
          ),
        })
      }

      if (filter.nome) {
        whereAnd.push(
          SequelizeFilterUtils.ilike(
            'pilulaSouLeve',
            'nome',
            filter.nome,
          ),
        )
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

      if (filter.frase) {
        whereAnd.push(
          SequelizeFilterUtils.ilike(
            'pilulaSouLeve',
            'frase',
            filter.frase,
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
    } = await options.database.pilulaSouLeve.findAndCountAll(
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
   * Lists the PilulaSouLeves to populate the autocomplete.
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
              'pilulaSouLeve',
              'nome',
              query,
            ),
          },
        ],
      }
    }

    const records = await options.database.pilulaSouLeve.findAll(
      {
        attributes: ['id', 'nome'],
        where,
        limit: limit ? Number(limit) : undefined,
        orderBy: [['nome', 'ASC']],
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
        audio: data.audio,
      }
    }

    await AuditLogRepository.log(
      {
        entityName: 'pilulaSouLeve',
        entityId: record.id,
        action,
        values,
      },
      options,
    )
  }

  /**
   * Fills an array of PilulaSouLeve with relations and files.
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
   * Fill the PilulaSouLeve with the relations and files.
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

    output.audio = await FileRepository.fillDownloadUrl(
      await record.getAudio({
        transaction,
      }),
    )

    return output
  }

  //Rotas App
  static async appFindAndCountAll (
    { filter, limit = 0, offset = 0, orderBy = '' },
    options: IRepositoryOptions,
    id = '',
    token = '',
  ) {
    const transaction = SequelizeRepository.getTransaction(
      options,
    )

    let rowsTmp = await options.database.programaCliente.findAll(
      {
        where: {
          clienteId: id,
        },
        transaction,
      },
    )

    var programas: string[] = []
    rowsTmp.forEach((element) => {
      programas.push(element.programaId)
    })

    let whereAnd: Array<any> = []
    let include = [
      {
        model: options.database.programa,
        as: 'programa',
      },
    ]

    whereAnd.push({
      programaId: {
        [Op.in]: programas,
      },
    })

    const where = { [Op.and]: whereAnd }

    let {
      rows,
      count,
    } = await options.database.pilulaSouLeve.findAndCountAll(
      {
        where,
        include,
        limit: limit ? Number(limit) : undefined,
        offset: offset ? Number(offset) : undefined,
        order: orderBy
          ? [orderBy.split('_')]
          : [['dia', 'ASC']],
        transaction: SequelizeRepository.getTransaction(
          options,
        ),
      },
    )

    rows = await this._fillWithRelationsAndFilesForRows(
      rows,
      options,
    )

    rows.forEach((e1) => {
      rowsTmp.forEach((e2) => {
        if (e1.programaId == e2.programaId) {
          var dias = e1.dia - 1
          e1.mostrar = new Date(e2.dataInicio)
          e1.dataFinal = new Date(e2.dataInicio)
          e1.inicio = e2.dataInicio
          e1.mostrar.setDate(e1.mostrar.getDate() + dias) 
          e1.dataFinal.setDate(e1.dataFinal.getDate() + e1.programa.dias) 
        }
      })
    })

    var agora = new Date()
    for (let index = rows.length - 1; index >= 0; index--) {
      if (rows[index] != undefined && rows[index].mostrar > agora) {
        rows.splice(index, 1)
      }

      if (rows[index] != undefined && rows[index].dataFinal <= agora) {
        rows.splice(index, 1)
      }
    }

    return { rows, count }
  }

  static async appFindById (
    id,
    options: IRepositoryOptions,
  ) {
    const transaction = SequelizeRepository.getTransaction(
      options,
    )

    const include = [
      {
        model: options.database.programa,
        as: 'programa',
      },
    ]

    const record = await options.database.pilulaSouLeve.findByPk(
      id,
      {
        include,
        transaction,
      },
    )

    return this._fillWithRelationsAndFiles(record, options)
  }
}

export default PilulaSouLeveRepository
