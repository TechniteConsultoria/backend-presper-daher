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
 * Handles database operations for the Tarefa.
 * See https://sequelize.org/v5/index.html to learn how to customize it.
 */
class TarefaRepository {
  /**
   * Creates the Tarefa.
   *
   * @param {Object} data
   * @param {Object} [options]
   */

  static async createDiasTarefas(
    data,
    options: IRepositoryOptions,
  ) {
    const currentUser =
      SequelizeRepository.getCurrentUser(options);

    const tenant =
      SequelizeRepository.getCurrentTenant(options);

    const transaction =
      SequelizeRepository.getTransaction(options);

    let diaSeguinte = new Date()
      
    for (let i = 0; i < data.diasTarefas; i++) {
      diaSeguinte.setDate(diaSeguinte.getDate()+1)
      const record = await options.database.tarefa.create({
        ...lodash.pick(data, [
          'nome',
          'dataTarefa',
          'status',
        ]),
        tenantId: tenant.id,
        dataTarefa: diaSeguinte,
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

    const record = await options.database.tarefa.create(
      {
        ...lodash.pick(data, [
          'nome',
          'dataTarefa',
          'status',
        ]),
        tenantId: tenant.id,
        createdById: currentUser.id,
        updatedById: currentUser.id,
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
   * Updates the Tarefa.
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

    let record = await options.database.tarefa.findByPk(
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
          'nome',
          'dataTarefa',
          'status',
        ]),
        updatedById: currentUser.id,
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
   * Deletes the Tarefa.
   *
   * @param {string} id
   * @param {Object} [options]
   */
  static async destroy(id, options: IRepositoryOptions) {
    const transaction =
      SequelizeRepository.getTransaction(options);

    let record = await options.database.tarefa.findByPk(
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
   * Finds the Tarefa and its relations.
   *
   * @param {string} id
   * @param {Object} [options]
   */
  static async findById(id, options: IRepositoryOptions) {
    const transaction =
      SequelizeRepository.getTransaction(options);

    const include = [];

    const record = await options.database.tarefa.findByPk(
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
   * Counts the number of Tarefas based on the filter.
   *
   * @param {Object} filter
   * @param {Object} [options]
   */
  static async count(filter, options: IRepositoryOptions) {
    const transaction =
      SequelizeRepository.getTransaction(options);

    const tenant =
      SequelizeRepository.getCurrentTenant(options);

    return options.database.tarefa.count(
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
   * Finds the Tarefas based on the query.
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

      if (filter.nome) {
        whereAnd.push(
          SequelizeFilterUtils.ilike(
            'tarefa',
            'nome',
            filter.nome,
          ),
        );
      }

      if (
        filter.status === true ||
        filter.status === 'true' ||
        filter.status === false ||
        filter.status === 'false'
      ) {
        whereAnd.push({
          status:
            filter.status === true ||
            filter.status === 'true',
        });
      }

      if (filter.dataTarefaRange) {
        const [start, end] = filter.dataTarefaRange;

        if (
          start !== undefined &&
          start !== null &&
          start !== ''
        ) {
          whereAnd.push({
            dataTarefa: {
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
            dataTarefa: {
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
      await options.database.tarefa.findAndCountAll({
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
   * Lists the Tarefas to populate the autocomplete.
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
              'tarefa',
              'nome',
              query,
            ),
          },
        ],
      };
    }

    const records = await options.database.tarefa.findAll({
      attributes: ['id', 'nome'],
      where,
      limit: limit ? Number(limit) : undefined,
      orderBy: [['nome', 'ASC']],
    });

    return records.map((record) => ({
      id: record.id,
      label: record.nome,
    }));
  }

  static async findAllAutocompleteDistinct(
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
              'tarefa',
              'nome',
              query,
            ),
          },
        ],
      };
    }

    const records = await options.database.tarefa.findAll({
      attributes: ['id', 'nome', 'avaliacaoId'],
      where,
      group: ['nome'],
      limit: limit ? Number(limit) : undefined,
      orderBy: [['nome', 'ASC']],
    });

    return records.map((record) => ({
      id: record.id,
      avaliacao: record.avaliacaoId,
      label: record.nome,
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
        entityName: 'tarefa',
        entityId: record.id,
        action,
        values,
      },
      options,
    );
  }

  /**
   * Fills an array of Tarefa with relations and files.
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
   * Fill the Tarefa with the relations and files.
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

    const record = await options.database.tarefa.findAll(
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

  static async appUpdate (
    id,
    data,
    options: IRepositoryOptions,
  ) {
    
    const transaction = SequelizeRepository.getTransaction(
      options,
    )

    let record = await options.database.tarefa.findByPk(
      id,
      {
        transaction,
      },
    )
    console.log(record)

    record = await record.update(
      {
        ...lodash.pick(data, [
          'nome',
          'dataTarefa',
          'status',
        ]),
        updatedById: data.id,
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

  static async appFindAndCountAll(id,
    { filter, limit = 0, offset = 0, orderBy = '' },
    options: IRepositoryOptions,
  ) {
    let whereAnd: Array<any> = [];
    let include = [];

    whereAnd.push({
      ['avaliacaoId']: SequelizeFilterUtils.uuid(id),
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

      if (filter.nome) {
        whereAnd.push(
          SequelizeFilterUtils.ilike(
            'tarefa',
            'nome',
            filter.nome,
          ),
        );
      }

      if (
        filter.status === true ||
        filter.status === 'true' ||
        filter.status === false ||
        filter.status === 'false'
      ) {
        whereAnd.push({
          status:
            filter.status === true ||
            filter.status === 'true',
        });
      }

      if (filter.dataTarefaRange) {
        const [start, end] = filter.dataTarefaRange;

        if (
          start !== undefined &&
          start !== null &&
          start !== ''
        ) {
          whereAnd.push({
            dataTarefa: {
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
            dataTarefa: {
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
      await options.database.tarefa.findAndCountAll({
        where ,
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
}

export default TarefaRepository;
