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
 * Handles database operations for the CursoCliente.
 * See https://sequelize.org/v5/index.html to learn how to customize it.
 */
class CursoClienteRepository {
  /**
   * Creates the CursoCliente.
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

    const record = await options.database.cursoCliente.create(
      {
        ...lodash.pick(data, [
        'data', 
        'importHash',
        'preco',
        'jsonIugu',
        'statusPgt',
        'idIugu',
        ]),
        tenantId: tenant.id,
        createdById: currentUser.id,
        updatedById: currentUser.id,
      },
      {
        transaction,
      },
    )

    await record.setCurso(data.curso || null, {
      transaction,
    })
    await record.setCliente(data.cliente || null, {
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
   * Updates the CursoCliente.
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

    let record = await options.database.cursoCliente.findByPk(
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
        ...lodash.pick(data, 
          ['data', 
          'importHash',
          'preco',
          'jsonIugu',
          'statusPgt',
          'idIugu',]),
        updatedById: currentUser.id,
      },
      {
        transaction,
      },
    )

    await record.setCurso(data.curso || null, {
      transaction,
    })
    await record.setCliente(data.cliente || null, {
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

  /**
   * Deletes the CursoCliente.
   *
   * @param {string} id
   * @param {Object} [options]
   */
  static async destroy (id, options: IRepositoryOptions) {
    const transaction = SequelizeRepository.getTransaction(
      options,
    )

    let record = await options.database.cursoCliente.findByPk(
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
   * Finds the CursoCliente and its relations.
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
        model: options.database.curso,
        as: 'curso',
      },
      {
        model: options.database.cliente,
        as: 'cliente',
      },
    ]

    const record = await options.database.cursoCliente.findByPk(
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
   * Counts the number of CursoClientes based on the filter.
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

    return options.database.cursoCliente.count(
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
   * Finds the CursoClientes based on the query.
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
        model: options.database.curso,
        as: 'curso',
      },
      {
        model: options.database.cliente,
        as: 'cliente',
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

      if (filter.curso) {
        whereAnd.push({
          ['cursoId']: SequelizeFilterUtils.uuid(
            filter.curso,
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

      if (filter.statusPgt) {
        whereAnd.push(
          SequelizeFilterUtils.ilike(
            'cursoCliente',
            'statusPgt',
            filter.statusPgt,
          ),
        )
      }
      
      if (filter.idIugu) {
        whereAnd.push(
          SequelizeFilterUtils.ilike(
            'cursoCliente',
            'idIugu',
            filter.idIugu,
          ),
        )
      }
    }

    const where = { [Op.and]: whereAnd }

    let {
      rows,
      count,
    } = await options.database.cursoCliente.findAndCountAll(
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

  static async rotinaBoleto(options: IRepositoryOptions){

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
    
    const transaction = SequelizeRepository.getTransaction(
      options,
    )

    const record = await options.database.cursoCliente.findAll(
      {
        where: {
          [Op.and]: [
            { statusPgt: 'não autorizado' },
          ]
        },
        include: []
      },
      {
        transaction,
      },
    )

    record.forEach(async (element) => {
      const url = `https://api.iugu.com/v1/invoices/${element.idIugu}?api_token=1350190590568F9D060683E04C9F398128BAF5EAB4B19532B052EEC52D34BBB0`;
      const options = {method: 'GET', headers: {Accept: 'application/json'}};

      await fetch(url, options)
        .then(res => res.json())
        .then(async json => 
          {
            if(json.status == 'paid'){
              let mudarStatus = await seq.query(
                `UPDATE cursoclientes 
                SET statusPgt = 'autorizado' 
                WHERE idIugu = '${element.idIugu}'`,
                { type: QueryTypes.UPDATE },
              );
            }
          }
        )
        .catch(err => console.error('error:' + err));
    });

    return 'Rotina executada com sucesso.';
  }

  /**
   * Lists the CursoClientes to populate the autocomplete.
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
        ],
      }
    }

    const records = await options.database.cursoCliente.findAll(
      {
        attributes: ['id', 'id'],
        where,
        limit: limit ? Number(limit) : undefined,
        orderBy: [['id', 'ASC']],
      },
    )

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
        entityName: 'cursoCliente',
        entityId: record.id,
        action,
        values,
      },
      options,
    )
  }

  /**
   * Fills an array of CursoCliente with relations and files.
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
   * Fill the CursoCliente with the relations and files.
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

  static async appFindAndCountAll (
    id,
    { filter, limit = 0, offset = 0, orderBy = '' },
    options: IRepositoryOptions,
  ) {
    let whereAnd: Array<any> = []
    let include = [
      {
        model: options.database.file,
        as: 'imagem',
      },

      {
        model: options.database.cursoCliente,
        as: 'cursoCliente',
        required: false,
        where: {
          clienteId: id,
        },
      },
    ]

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

    let clienteStatus = await seq.query(
      'SELECT Max(CASE  ' +
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
        ' WHERE  clientes.deletedat IS NULL  ' +
        "AND clientes.id = '" +
        id +
        "' " +
        'GROUP  BY clientes.id ',
      { type: QueryTypes.SELECT },
    )

    let status = clienteStatus[0]['statusPlano']

    whereAnd.push({
      [Op.or]: [
        {
          ['$cursoCliente.clienteId$']: {
            [Op.not]: null,
          },
        },

        Sequelize.literal(
          "REPLACE(REPLACE(REPLACE(`liberado`,'Gratuito','0'),'Ativo','2'),'Inativo','1') LIKE '%" +
            status +
            "%' ",
        ),
      ],
    })

    const where = { [Op.and]: whereAnd }

    let {
      rows,
      count,
    } = await options.database.curso.findAndCountAll({
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

  static async appFindById (
    id,
    options: IRepositoryOptions,
  ) {
    const transaction = SequelizeRepository.getTransaction(
      options,
    )

    const record = await options.database.curso.findAll(
      {
        where: {
          id: id,
        },
      },
      {
        transaction,
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
    
    const transaction = SequelizeRepository.getTransaction(
      options,
    )

    // Para listagem no backoffice
    let idTenant = '918b114d-7331-41cb-b936-6ff999d4a281';

    const record = await options.database.cursoCliente.create(
      {
        ...lodash.pick(data, [
          'data', 
          'importHash',
          'preco',
          'jsonIugu',
          'statusPgt',
        ]),
        createdById: currentUser.id,
        updatedById: currentUser.id,
        tenantId: '918b114d-7331-41cb-b936-6ff999d4a281'
      },
      {
        transaction,
      },
    )
    console.log('Lorem ispsum lorem ipsum Lorem ispsum lorem ipsum Lorem ispsum lorem ipsum Lorem ispsum lorem ipsum Lorem ispsum lorem ipsum Lorem ispsum lorem ipsum Lorem ispsum lorem ipsum Lorem ispsum lorem ipsum')
    
    await record.setCurso(data.curso || null, {
      transaction,
    })
    await record.setCliente(data.cliente || null, {
      transaction,
    })

    await this._createAuditLog(
      AuditLogRepository.CREATE,
      record,
      data,
      options,
    )    
  }

  static async appUltimoAdquirido (
    id,
    { filter, limit = 0, offset = 0, orderBy = '' },
    options: IRepositoryOptions,
  ) {
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

    let ultimoAdquirido = new Array()

    let clienteStatus = await seq
      .query(
        'SELECT Max(CASE  ' +
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
          ' WHERE  clientes.deletedat IS NULL  ' +
          "AND clientes.id = '" +
          id +
          "' " +
          'GROUP  BY clientes.id ',
        { type: QueryTypes.SELECT },
      )
      .then(async (result) => {
        let status = result[0]['statusPlano']

        ultimoAdquirido = await seq.query(
          'SELECT a.*, c.privateUrl ' +
            'FROM cursos AS a ' +
            'LEFT JOIN cursoClientes AS b ' +
            'ON a.id = b.cursoId ' +
            'LEFT JOIN files AS c ' +
            'ON a.id = c.belongsToId ' +
            "WHERE REPLACE(REPLACE(REPLACE(`liberado`,'Gratuito','0'),'Ativo','2'),'Inativo','1') LIKE '%" +
            status +
            "%' " +
            " OR b.clienteId = '" +
            id +
            "' " +
            'AND a.deletedAt is null ' +
            'ORDER BY a.createdAt DESC ' +
            'LIMIT 1',
          { type: QueryTypes.SELECT },
        )
      })
      .catch((err) => {
        console.log(err)
      })

    return ultimoAdquirido
  }
}

export default CursoClienteRepository
