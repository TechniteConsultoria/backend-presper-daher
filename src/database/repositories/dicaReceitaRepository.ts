import SequelizeRepository from '../../database/repositories/sequelizeRepository'
import AuditLogRepository from '../../database/repositories/auditLogRepository'
import lodash from 'lodash'
import SequelizeFilterUtils from '../../database/utils/sequelizeFilterUtils'
import Error404 from '../../errors/Error404'
import Sequelize from 'sequelize'
import FileRepository from './fileRepository'
import { IRepositoryOptions } from './IRepositoryOptions'
import { getConfig } from '../../config'

const highlight = require('cli-highlight').highlight

const Op = Sequelize.Op

/**
 * Handles database operations for the DicaReceita.
 * See https://sequelize.org/v5/index.html to learn how to customize it.
 */
class DicaReceitaRepository {
  /**
   * Creates the DicaReceita.
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

    if (data.recorrente == 'Sim') {
      let dataInicio = new Date(data.dataDe);

      let hora = new Date(data.horaConteudo);
      
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

        if (gravar) {
          
          data.dataListagem = dataInicio; 

          const record = await options.database.dicaReceita.create(
            {
              ...lodash.pick(data, [
                'tipo',
                'urlVideo',
                'nome',
                'texto',
                'importHash',
                'dataListagem',
                'destinatarios',
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
              belongsTo: options.database.dicaReceita.getTableName(),
              belongsToColumn: 'imagem',
              belongsToId: record.id,
            },
            data.imagem,
            options,
          )
      
          await this._createAuditLog(
            AuditLogRepository.CREATE,
            record,
            data,
            options,
          )
        }
        dataInicio.setDate(dataInicio.getDate() + 1)
      }
      return;
    }

    const record = await options.database.dicaReceita.create(
      {
        ...lodash.pick(data, [
          'tipo',
          'urlVideo',
          'nome',
          'texto',
          'importHash',
          'dataListagem',
          'destinatarios',
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
        belongsTo: options.database.dicaReceita.getTableName(),
        belongsToColumn: 'imagem',
        belongsToId: record.id,
      },
      data.imagem,
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
   * Updates the DicaReceita.
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

    let record = await options.database.dicaReceita.findByPk(
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
          'tipo',
          'urlVideo',
          'nome',
          'texto',
          'importHash',
          'dataListagem',
          'destinatarios',
        ]),
        updatedById: currentUser.id,
      },
      {
        transaction,
      },
    )

    await FileRepository.replaceRelationFiles(
      {
        belongsTo: options.database.dicaReceita.getTableName(),
        belongsToColumn: 'imagem',
        belongsToId: record.id,
      },
      data.imagem,
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
   * Deletes the DicaReceita.
   *
   * @param {string} id
   * @param {Object} [options]
   */
  static async destroy (id, options: IRepositoryOptions) {
    const transaction = SequelizeRepository.getTransaction(
      options,
    )

    let record = await options.database.dicaReceita.findByPk(
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
   * Finds the DicaReceita and its relations.
   *
   * @param {string} id
   * @param {Object} [options]
   */
  static async findById (id, options: IRepositoryOptions) {
    const transaction = SequelizeRepository.getTransaction(
      options,
    )

    const include = []

    const record = await options.database.dicaReceita.findByPk(
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
   * Counts the number of DicaReceitas based on the filter.
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

    return options.database.dicaReceita.count(
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
   * Finds the DicaReceitas based on the query.
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

  static async findCalendario (
    res,
    options: IRepositoryOptions,
  ) {
    let offset = 0
    let orderBy = ''

    //let whereAnd: Array<any> = []
    /* let include = [
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
    ] */

    const currentUser = SequelizeRepository.getCurrentUser(
      options,
    )
    //  whereAnd.push({ nutricionistaId: currentUser.id })

    //  const where = { [Op.and]: whereAnd }

    let {
      rows,
    } = await options.database.dicaReceita.findAndCountAll({
      // where,
      //include,
      offset: offset ? Number(offset) : undefined,
      order: orderBy
        ? [orderBy.split('_')]
        : [['dataListagem', 'ASC']],
      transaction: SequelizeRepository.getTransaction(
        options,
      ),
    })

    //return rows;

    let calendario: any[] = []

    rows.forEach((i) => {
      let color

      if (i.tipo == 'Receita') {
        color = '#3cb362'
      }

      if (i.tipo == 'Dica') {
        color = '#009688'
      }

      calendario.push({
        id: i.id,
        title: i.nome,
        start: i.dataListagem,
        description: i.texto,
        color: color,
        status: i.texto,
        tipo: i.tipo,
      })
    })

    /* rows = await this._fillWithRelationsAndFilesForRows(
      rows,
      options,
    ) */

    if (calendario.length == 0) {
      return res
        .status(401)
        .send({ mensagem: 'não autorizado' })
    }

    return { calendario }
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

    whereAnd.push({
      tenantId: tenant.id,
    })

    if (filter) {
      if (filter.id) {
        whereAnd.push({
          ['id']: SequelizeFilterUtils.uuid(filter.id),
        })
      }

      if (filter.tipo) {
        whereAnd.push({
          tipo: filter.tipo,
        })
      }

      if (filter.urlVideo) {
        whereAnd.push(
          SequelizeFilterUtils.ilike(
            'dicaReceita',
            'urlVideo',
            filter.urlVideo,
          ),
        )
      }

      if (filter.nome) {
        whereAnd.push(
          SequelizeFilterUtils.ilike(
            'dicaReceita',
            'nome',
            filter.nome,
          ),
        )
      }

      if (filter.texto) {
        whereAnd.push(
          SequelizeFilterUtils.ilike(
            'dicaReceita',
            'texto',
            filter.texto,
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
    } = await options.database.dicaReceita.findAndCountAll({
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
   * Lists the DicaReceitas to populate the autocomplete.
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
              'dicaReceita',
              'nome',
              query,
            ),
          },
        ],
      }
    }

    const records = await options.database.dicaReceita.findAll(
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
        imagem: data.imagem,
      }
    }

    await AuditLogRepository.log(
      {
        entityName: 'dicaReceita',
        entityId: record.id,
        action,
        values,
      },
      options,
    )
  }

  /**
   * Fills an array of DicaReceita with relations and files.
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
   * Fill the DicaReceita with the relations and files.
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

    output.imagem = await FileRepository.fillDownloadUrl(
      await record.getImagem({
        transaction,
      }),
    )

    return output
  }

  //Rotas App
  static async appPilulaFindAndCountAll (
    params,
    options: IRepositoryOptions,
  ) {
    let dataAtual = new Date()
    let whereAnd: Array<any> = []
    let include = [
      {
        model: options.database.file,
        as: 'imagem',
      },
    ]

    whereAnd.push({
      tipo: 'Pilula',
    })

    whereAnd.push({
      dataListagem: { [Op.lte]: dataAtual },
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
        params.id +
        "' " +
        'GROUP  BY clientes.id ',
      { type: QueryTypes.SELECT },
    )
    let status = clienteStatus[0]['statusPlano']

    whereAnd.push(
      Sequelize.literal(
        "REPLACE(REPLACE(REPLACE(`destinatarios`,'Gratuito','0'),'Ativo','2'),'Inativo','1') LIKE '%" +
          status +
          "%' ",
      ),
    )

    const where = { [Op.and]: whereAnd }
    
    let {
      rows,
      count,
    } = await options.database.dicaReceita.findAndCountAll({
      where,
      include,
      limit: 1,
      order: [['dataListagem', 'DESC']],
      transaction: SequelizeRepository.getTransaction(
        options,
      ),
    })

    return rows
  }


   static async appProdutoFindAndCountAll (
    params,
    options: IRepositoryOptions,
  ) {
    let dataAtual = new Date()
    let whereAnd: Array<any> = []
    let include = [
      {
        model: options.database.file,
        as: 'imagem',
      },
    ]

    whereAnd.push({
      tipo: 'Produto',
    })

    whereAnd.push({
      dataListagem: { [Op.lte]: dataAtual },
    })

    /* let seq = new (<any>Sequelize)(
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
        params.id +
        "' " +
        'GROUP  BY clientes.id ',
      { type: QueryTypes.SELECT },
    )
    let status = clienteStatus[0]['statusPlano']

    whereAnd.push(
      Sequelize.literal(
        "REPLACE(REPLACE(REPLACE(`destinatarios`,'Gratuito','0'),'Ativo','2'),'Inativo','1') LIKE '%" +
          status +
          "%' ",
      ),
    ) */

    const where = { [Op.and]: whereAnd }
    
    let {
      rows,
      count,
    } = await options.database.dicaReceita.findAndCountAll({
      where,
      include,
      order: [['dataListagem', 'DESC']],
      transaction: SequelizeRepository.getTransaction(
        options,
      ),
    })

    return rows
  }
  

  static async appDicaFindAndCountAll (
    params,
    options: IRepositoryOptions,
  ) {
    let dataAtual = new Date()
    let whereAnd: Array<any> = []
    let include = [
      {
        model: options.database.file,
        as: 'imagem',
      },
    ]

    whereAnd.push({
      tipo: 'Dica',
    })

    whereAnd.push({
      dataListagem: { [Op.lte]: dataAtual },
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
        params.id +
        "' " +
        'GROUP  BY clientes.id ',
      { type: QueryTypes.SELECT },
    )
    let status = clienteStatus[0]['statusPlano']

    whereAnd.push(
      Sequelize.literal(
        "REPLACE(REPLACE(REPLACE(`destinatarios`,'Gratuito','0'),'Ativo','2'),'Inativo','1') LIKE '%" +
          status +
          "%' ",
      ),
    )

    const where = { [Op.and]: whereAnd }
    let {
      rows,
      count,
    } = await options.database.dicaReceita.findAndCountAll({
      where,
      include,
      limit: 1,
      order: [['dataListagem', 'DESC']],
      transaction: SequelizeRepository.getTransaction(
        options,
      ),
    })

    return rows
  }

  static async appReceitaFindAndCountAll (
    params,
    options: IRepositoryOptions,
  ) {
    let dataAtual = new Date()
    let whereAnd: Array<any> = []
    let include = [
      {
        model: options.database.file,
        as: 'imagem',
      },
    ]

    whereAnd.push({
      tipo: 'Receita',
    })

    whereAnd.push({
      dataListagem: { [Op.lte]: dataAtual },
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
        params.id +
        "' " +
        'GROUP  BY clientes.id ',
      { type: QueryTypes.SELECT },
    )
    let status = clienteStatus[0]['statusPlano']

    whereAnd.push(
      Sequelize.literal(
        "REPLACE(REPLACE(REPLACE(`destinatarios`,'Gratuito','0'),'Ativo','2'),'Inativo','1') LIKE '%" +
          status +
          "%' ",
      ),
    )

    const where = { [Op.and]: whereAnd }

    let {
      rows,
      count,
    } = await options.database.dicaReceita.findAndCountAll({
      where,
      include,
      limit: 1,
      order: [['dataListagem', 'DESC']],
      transaction: SequelizeRepository.getTransaction(
        options,
      ),
    })

    return rows
  }

  static async appPilulaFindById (
    id,
    options: IRepositoryOptions,
  ) {
    const transaction = SequelizeRepository.getTransaction(
      options,
    )

    const include = []

    const record = await options.database.dicaReceita.findByPk(
      id,
      {
        include,
        transaction,
      },
    )

    return this._fillWithRelationsAndFiles(record, options)
  }

  static async appProdutoFindById (
    id,
    options: IRepositoryOptions,
  ) {
    const transaction = SequelizeRepository.getTransaction(
      options,
    )

    const include = []

    const record = await options.database.dicaReceita.findByPk(
      id,
      {
        include,
        transaction,
      },
    )

    return this._fillWithRelationsAndFiles(record, options)
  }

  static async appDicaFindById (
    id,
    options: IRepositoryOptions,
  ) {
    const transaction = SequelizeRepository.getTransaction(
      options,
    )

    const include = []

    const record = await options.database.dicaReceita.findByPk(
      id,
      {
        include,
        transaction,
      },
    )

    return this._fillWithRelationsAndFiles(record, options)
  }

  static async appReceitaFindById (
    id,
    options: IRepositoryOptions,
  ) {
    const transaction = SequelizeRepository.getTransaction(
      options,
    )

    const include = []

    const record = await options.database.dicaReceita.findByPk(
      id,
      {
        include,
        transaction,
      },
    )

    return this._fillWithRelationsAndFiles(record, options)
  }
}

export default DicaReceitaRepository
