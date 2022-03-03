import SequelizeRepository from '../../database/repositories/sequelizeRepository';
import AuditLogRepository from '../../database/repositories/auditLogRepository';
import lodash from 'lodash';
import SequelizeFilterUtils from '../../database/utils/sequelizeFilterUtils';
import Error404 from '../../errors/Error404';
import Sequelize from 'sequelize';
import FileRepository from './fileRepository';
import { IRepositoryOptions } from './IRepositoryOptions';
import { getConfig } from '../../config';

const highlight = require('cli-highlight').highlight;
const Op = Sequelize.Op;

/**
 * Handles database operations for the Pergunta.
 * See https://sequelize.org/v5/index.html to learn how to customize it.
 */
class PerguntaRepository {
  /**
   * Creates the Pergunta.
   *
   * @param {Object} data
   * @param {Object} [options]
   */

  static async createDiasPerguntas(
    data,
    options: IRepositoryOptions,
  ) {
    const currentUser =
      SequelizeRepository.getCurrentUser(options);

    const tenant =
      SequelizeRepository.getCurrentTenant(options);

    const transaction =
      SequelizeRepository.getTransaction(options);

    let dia = new Date()
      
    for (let i = 0; i < data.diasPerguntas; i++) {
      dia.setDate(dia.getDate())
      const record = await options.database.pergunta.create({
        ...lodash.pick(data, [
          'dataPergunta',
          'perguntaNutri',
          'resposta',
          'notificacao',
          'notificacaoOffice',          
        ]),
        tenantId: tenant.id,
        dataPergunta: dia,
        createdById: currentUser.id,
        updatedById: currentUser.id,
      });
      await record.setAvaliacao(data.avaliacao || null);

      await this._createAuditLog(
        AuditLogRepository.CREATE,
        record,
        data,
        options,
      );
    }
  }

  static async create(data, options: IRepositoryOptions) {
    const currentUser =
      SequelizeRepository.getCurrentUser(options);

    const tenant =
      SequelizeRepository.getCurrentTenant(options);

    const transaction =
      SequelizeRepository.getTransaction(options);

    let diaSeguinte = new Date()
    diaSeguinte.setDate(diaSeguinte.getDate())

    const record = await options.database.pergunta.create(
      {
        ...lodash.pick(data, [
          'dataPergunta',
          'perguntaNutri',
          'resposta',          
          'notificacao',  
        ]),
        tenantId: tenant.id,
        dataPergunta: diaSeguinte,
        createdById: currentUser.id,
        updatedById: currentUser.id,
        notificacaoOffice: 1,
      },
      {
        transaction,
      },
    );

    await record.setAvaliacao(data.avaliacao || null, {
      transaction,
    });

    await this._createAuditLog(
      AuditLogRepository.CREATE,
      record,
      data,
      options,
    );

    return this.findById(record.id, options);
  }

  /**
   * Updates the Pergunta.
   *
   * @param {Object} data
   * @param {Object} [options]
   */
  static async update(
    id,
    data,
    options: IRepositoryOptions,
  ) {
    const currentUser =
      SequelizeRepository.getCurrentUser(options);

    const transaction =
      SequelizeRepository.getTransaction(options);

    let record = await options.database.pergunta.findByPk(
      id,
      {
        transaction,
      },
    );

    const tenant =
      SequelizeRepository.getCurrentTenant(options);

    if (
      !record ||
      String(record.tenantId) !== String(tenant.id)
    ) {
      throw new Error404();
    }

    record = await record.update(
      {
        ...lodash.pick(data, [
          'dataPergunta',
          'perguntaNutri',
          'resposta',
          'notificacao',
        ]),
        updatedById: currentUser.id,
        notificacaoOffice: 0,
        notificacao: 1,
      },
      {
        transaction,
      },
    );

    await record.setAvaliacao(data.avaliacao || null, {
      transaction,
    });

    await this._createAuditLog(
      AuditLogRepository.UPDATE,
      record,
      data,
      options,
    );

    return this.findById(record.id, options);
  }

  /**
   * Deletes the Pergunta.
   *
   * @param {string} id
   * @param {Object} [options]
   */
  static async destroy(id, options: IRepositoryOptions) {
    const transaction =
      SequelizeRepository.getTransaction(options);

    let record = await options.database.pergunta.findByPk(
      id,
      {
        transaction,
      },
    );

    const tenant =
      SequelizeRepository.getCurrentTenant(options);

    if (
      !record ||
      String(record.tenantId) !== String(tenant.id)
    ) {
      throw new Error404();
    }

    await record.destroy({
      transaction,
    });

    await this._createAuditLog(
      AuditLogRepository.DELETE,
      record,
      record,
      options,
    );
  }

  /**
   * Finds the Pergunta and its relations.
   *
   * @param {string} id
   * @param {Object} [options]
   */
  static async findById(id, options: IRepositoryOptions) {
    const transaction =
      SequelizeRepository.getTransaction(options);

    const include = [];

    const record = await options.database.pergunta.findByPk(
      id,
      {
        include,
        transaction,
      },
    );

    const tenant =
      SequelizeRepository.getCurrentTenant(options);

    if (
      !record ||
      String(record.tenantId) !== String(tenant.id)
    ) {
      throw new Error404();
    }

    return this._fillWithRelationsAndFiles(record, options);
  }

  /**
   * Counts the number of Perguntas based on the filter.
   *
   * @param {Object} filter
   * @param {Object} [options]
   */
  static async count(filter, options: IRepositoryOptions) {
    const transaction =
      SequelizeRepository.getTransaction(options);

    const tenant =
      SequelizeRepository.getCurrentTenant(options);

    return options.database.pergunta.count(
      {
        where: {
          ...filter,
          tenantId: tenant.id,
        },
      },
      {
        transaction,
      },
    );
  }

  /**
   * Finds the Perguntas based on the query.
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
    const tenant =
      SequelizeRepository.getCurrentTenant(options);

    let whereAnd: Array<any> = [];
    let include = [];

    whereAnd.push({
      tenantId: tenant.id,
    });

    if (filter) {
      if (filter.id) {
        whereAnd.push({
          ['id']: SequelizeFilterUtils.uuid(filter.id),
        });
      }

      if (filter.avaliacaoId) {
        whereAnd.push({
          ['avaliacaoId']: SequelizeFilterUtils.uuid(
            filter.avaliacaoId,
          ),
        });
      }

      if (filter.dataPerguntaRange) {
        const [start, end] = filter.dataPerguntaRange;

        if (
          start !== undefined &&
          start !== null &&
          start !== ''
        ) {
          whereAnd.push({
            dataPergunta: {
              [Op.gte]: start,
            },
          });
        }

        if (
          end !== undefined &&
          end !== null &&
          end !== ''
        ) {
          whereAnd.push({
            dataPergunta: {
              [Op.lte]: end,
            },
          });
        }
      }

      if (filter.createdAtRange) {
        const [start, end] = filter.createdAtRange;

        if (
          start !== undefined &&
          start !== null &&
          start !== ''
        ) {
          whereAnd.push({
            ['createdAt']: {
              [Op.gte]: start,
            },
          });
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
          });
        }
      }
    }

    const where = { [Op.and]: whereAnd };

    let { rows, count } =
      await options.database.pergunta.findAndCountAll({
        where,
        include,
        limit: limit ? Number(limit) : undefined,
        offset: offset ? Number(offset) : undefined,
        order: orderBy
          ? [orderBy.split('_')]
          : [['createdAt', 'DESC']],
        transaction:
          SequelizeRepository.getTransaction(options),
      });

    rows = await this._fillWithRelationsAndFilesForRows(
      rows,
      options,
    );

    return { rows, count };
  }

  /**
   * Lists the Perguntas to populate the autocomplete.
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
    const tenant =
      SequelizeRepository.getCurrentTenant(options);

    let where: any = {
      tenantId: tenant.id,
    };

    if (query) {
      where = {
        ...where,
        [Op.or]: [
          { ['id']: SequelizeFilterUtils.uuid(query) },
          {
            [Op.and]: SequelizeFilterUtils.ilike(
              'pergunta',
              'perguntaNutri',
              query,
            ),
          },
        ],
      };
    }

    const records = await options.database.pergunta.findAll({
      attributes: ['id', 'perguntaNutri'],
      where,
      limit: limit ? Number(limit) : undefined,
      orderBy: [['perguntaNutri', 'ASC']],
    });

    return records.map((record) => ({
      id: record.id,
      label: record.perguntaNutri,
    }));
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
    let values = {};

    if (data) {
      values = {
        ...record.get({ plain: true }),
        imagem: data.imagem,
      };
    }

    await AuditLogRepository.log(
      {
        entityName: 'pergunta',
        entityId: record.id,
        action,
        values,
      },
      options,
    );
  }

  /**
   * Fills an array of Pergunta with relations and files.
   *
   * @param {Array} rows
   * @param {Object} [options]
   */
  static async _fillWithRelationsAndFilesForRows(
    rows,
    options: IRepositoryOptions,
  ) {
    if (!rows) {
      return rows;
    }

    return Promise.all(
      rows.map((record) =>
        this._fillWithRelationsAndFiles(record, options),
      ),
    );
  }

  /**
   * Fill the Pergunta with the relations and files.
   *
   * @param {Object} record
   * @param {Object} [options]
   */
  static async _fillWithRelationsAndFiles(
    record,
    options: IRepositoryOptions,
  ) {
    if (!record) {
      return record;
    }

    const output = record.get({ plain: true });

    const transaction =
      SequelizeRepository.getTransaction(options);

    return output;
  }

  static async appFindById(
    id,
    options: IRepositoryOptions,
  ) {
    const transaction =
      SequelizeRepository.getTransaction(options);

    const record = await options.database.pergunta.findAll(
      {
        where: {
          id: id,
        },
      },
      {
        transaction,
      },
    );

    return record;
  }

  static async appFindAndCountAll(
    idAvaliacao,
    { filter, limit = 0, offset = 0, orderBy = '' },
    options: IRepositoryOptions,
  ) {
    let whereAnd: Array<any> = [];
    let include = [];

    whereAnd.push({
      ['avaliacaoId']: SequelizeFilterUtils.uuid(idAvaliacao),
    });

    if (filter) {
      if (filter.id) {
        whereAnd.push({
          ['id']: SequelizeFilterUtils.uuid(filter.id),
        });
      }

      if (filter.avaliacaoId) {
        whereAnd.push({
          ['avaliacaoId']: SequelizeFilterUtils.uuid(
            filter.avaliacaoId,
          ),
        });
      }


      if (filter.dataPerguntaRange) {
        const [start, end] = filter.dataPerguntaRange;

        if (
          start !== undefined &&
          start !== null &&
          start !== ''
        ) {
          whereAnd.push({
            dataPergunta: {
              [Op.gte]: start,
            },
          });
        }

        if (
          end !== undefined &&
          end !== null &&
          end !== ''
        ) {
          whereAnd.push({
            dataPergunta: {
              [Op.lte]: end,
            },
          });
        }
      }

      if (filter.createdAtRange) {
        const [start, end] = filter.createdAtRange;

        if (
          start !== undefined &&
          start !== null &&
          start !== ''
        ) {
          whereAnd.push({
            ['createdAt']: {
              [Op.gte]: start,
            },
          });
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
          });
        }
      }
    }

    const where = { [Op.and]: whereAnd };

    let { rows, count } =
      await options.database.pergunta.findAndCountAll({
        where,
        include,
        limit: limit ? Number(limit) : undefined,
        offset: offset ? Number(offset) : undefined,
        order: orderBy
          ? [orderBy.split('_')]
          : [['createdAt', 'DESC']],
        transaction:
          SequelizeRepository.getTransaction(options),
      });

    rows = await this._fillWithRelationsAndFilesForRows(
      rows,
      options,
    );

    return { rows, count };
  }

  static async appUpdate (
    id,
    data,
    options: IRepositoryOptions,
  ) {
    
    const transaction = SequelizeRepository.getTransaction(
      options,
    )

    let record = await options.database.pergunta.findByPk(
      id,
      {
        transaction,
      },
    )

    record = await record.update(
      {
        ...lodash.pick(data, [
          'dataPergunta',
          'perguntaNutri',
          'resposta',
          'notificacao',
        ]),
        updatedById: data.id,
        notificacaoOffice: 0,
      },
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
    //return this.findById(record.id, options);
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
        
    let idTenant = '918b114d-7331-41cb-b936-6ff999d4a281';

    let diaSeguinte = new Date()
    diaSeguinte.setDate(diaSeguinte.getDate())
    const record = await options.database.pergunta.create(
      {
        ...lodash.pick(data, [
          'dataPergunta',
          'perguntaNutri',
          'resposta',
          'notificacao',
        ]),
        tenantId: idTenant,
        createdById: currentUser.id,
        updatedById: currentUser.id,
        dataPergunta: diaSeguinte,
        notificacaoOffice: 1,
      },
      {
        transaction,
      },
    )
 
    await record.setAvaliacao(data.avaliacao || null, {
      transaction,
    });

    await this._createAuditLog(
      AuditLogRepository.CREATE,
      record,
      data,
      options,
    )    
  }
}

export default PerguntaRepository;
