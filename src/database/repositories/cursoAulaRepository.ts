import SequelizeRepository from '../../database/repositories/sequelizeRepository';
import AuditLogRepository from '../../database/repositories/auditLogRepository';
import lodash from 'lodash';
import SequelizeFilterUtils from '../../database/utils/sequelizeFilterUtils';
import Error404 from '../../errors/Error404';
import Sequelize from 'sequelize';
import FileRepository from './fileRepository';
import { IRepositoryOptions } from './IRepositoryOptions';

const Op = Sequelize.Op;

/**
 * Handles database operations for the CursoAula.
 * See https://sequelize.org/v5/index.html to learn how to customize it.
 */
class CursoAulaRepository {
  /**
   * Creates the CursoAula.
   *
   * @param {Object} data
   * @param {Object} [options]
   */
  static async create(data, options: IRepositoryOptions) {
    const currentUser = SequelizeRepository.getCurrentUser(
      options,
    );

    const tenant = SequelizeRepository.getCurrentTenant(
      options,
    );

    const transaction = SequelizeRepository.getTransaction(
      options,
    );

    const record = await options.database.cursoAula.create(
      {
        ...lodash.pick(data, [
          'nome',
          'descricao',
          'url',          
          'importHash',
        ]),
        tenantId: tenant.id,
        createdById: currentUser.id,
        updatedById: currentUser.id,
      },
      {
        transaction,
      },
    );

    await record.setModulo(data.modulo || null, {
      transaction,
    });
  
    await FileRepository.replaceRelationFiles(
      {
        belongsTo: options.database.cursoAula.getTableName(),
        belongsToColumn: 'imagem',
        belongsToId: record.id,
      },
      data.imagem,
      options,
    );
    await FileRepository.replaceRelationFiles(
      {
        belongsTo: options.database.cursoAula.getTableName(),
        belongsToColumn: 'apostila',
        belongsToId: record.id,
      },
      data.apostila,
      options,
    );
    await FileRepository.replaceRelationFiles(
      {
        belongsTo: options.database.cursoAula.getTableName(),
        belongsToColumn: 'questionario',
        belongsToId: record.id,
      },
      data.questionario,
      options,
    );
  
    await this._createAuditLog(
      AuditLogRepository.CREATE,
      record,
      data,
      options,
    );

    return this.findById(record.id, options);
  }

  /**
   * Updates the CursoAula.
   *
   * @param {Object} data
   * @param {Object} [options]
   */
  static async update(id, data, options: IRepositoryOptions) {
    const currentUser = SequelizeRepository.getCurrentUser(
      options,
    );

    const transaction = SequelizeRepository.getTransaction(
      options,
    );

    let record = await options.database.cursoAula.findByPk(
      id,
      {
        transaction,
      },
    );

    const tenant = SequelizeRepository.getCurrentTenant(
      options,
    );

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
          'descricao',
          'url',          
          'importHash',
        ]),
        updatedById: currentUser.id,
      },
      {
        transaction,
      },
    );

    await record.setModulo(data.modulo || null, {
      transaction,
    });

    await FileRepository.replaceRelationFiles(
      {
        belongsTo: options.database.cursoAula.getTableName(),
        belongsToColumn: 'imagem',
        belongsToId: record.id,
      },
      data.imagem,
      options,
    );
    await FileRepository.replaceRelationFiles(
      {
        belongsTo: options.database.cursoAula.getTableName(),
        belongsToColumn: 'apostila',
        belongsToId: record.id,
      },
      data.apostila,
      options,
    );
    await FileRepository.replaceRelationFiles(
      {
        belongsTo: options.database.cursoAula.getTableName(),
        belongsToColumn: 'questionario',
        belongsToId: record.id,
      },
      data.questionario,
      options,
    );

    await this._createAuditLog(
      AuditLogRepository.UPDATE,
      record,
      data,
      options,
    );

    return this.findById(record.id, options);
  }

  /**
   * Deletes the CursoAula.
   *
   * @param {string} id
   * @param {Object} [options]
   */
  static async destroy(id, options: IRepositoryOptions) {
    const transaction = SequelizeRepository.getTransaction(
      options,
    );

    let record = await options.database.cursoAula.findByPk(
      id,
      {
        transaction,
      },
    );

    const tenant = SequelizeRepository.getCurrentTenant(
      options,
    );

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
   * Finds the CursoAula and its relations.
   *
   * @param {string} id
   * @param {Object} [options]
   */
  static async findById(id, options: IRepositoryOptions) {
    const transaction = SequelizeRepository.getTransaction(
      options,
    );

    const include = [
      {
        model: options.database.cursoModulo,
        as: 'modulo',
      },
    ];

    const record = await options.database.cursoAula.findByPk(
      id,
      {
        include,
        transaction,
      },
    );

    const tenant = SequelizeRepository.getCurrentTenant(
      options,
    );

    if (
      !record ||
      String(record.tenantId) !== String(tenant.id)
    ) {
      throw new Error404();
    }

    return this._fillWithRelationsAndFiles(record, options);
  }

  /**
   * Counts the number of CursoAulas based on the filter.
   *
   * @param {Object} filter
   * @param {Object} [options]
   */
  static async count(filter, options: IRepositoryOptions) {
    const transaction = SequelizeRepository.getTransaction(
      options,
    );

    const tenant = SequelizeRepository.getCurrentTenant(
      options,
    );

    return options.database.cursoAula.count(
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
   * Finds the CursoAulas based on the query.
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
    );

    let whereAnd: Array<any> = [];
    let include = [
      {
        model: options.database.cursoModulo,
        as: 'modulo',
      },      
    ];

    whereAnd.push({
      tenantId: tenant.id,
    });

    if (filter) {
      if (filter.id) {
        whereAnd.push({
          ['id']: SequelizeFilterUtils.uuid(filter.id),
        });
      }

      if (filter.modulo) {
        whereAnd.push({
          ['moduloId']: SequelizeFilterUtils.uuid(
            filter.modulo,
          ),
        });
      }

      if (filter.nome) {
        whereAnd.push(
          SequelizeFilterUtils.ilike(
            'cursoAula',
            'nome',
            filter.nome,
          ),
        );
      }

      if (filter.descricao) {
        whereAnd.push(
          SequelizeFilterUtils.ilike(
            'cursoAula',
            'descricao',
            filter.descricao,
          ),
        );
      }

      if (filter.url) {
        whereAnd.push(
          SequelizeFilterUtils.ilike(
            'cursoAula',
            'url',
            filter.url,
          ),
        );
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

    let {
      rows,
      count,
    } = await options.database.cursoAula.findAndCountAll({
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
    });

    rows = await this._fillWithRelationsAndFilesForRows(
      rows,
      options,
    );

    return { rows, count };
  }

  /**
   * Lists the CursoAulas to populate the autocomplete.
   * See https://sequelize.org/v5/manual/querying.html to learn how to
   * customize the query.
   *
   * @param {Object} query
   * @param {number} limit
   */
  static async findAllAutocomplete(query, limit, options: IRepositoryOptions) {
    const tenant = SequelizeRepository.getCurrentTenant(
      options,
    );

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
              'cursoAula',
              'nome',
              query,
            ),
          },
        ],
      };
    }

    const records = await options.database.cursoAula.findAll(
      {
        attributes: ['id', 'nome'],
        where,
        limit: limit ? Number(limit) : undefined,
        orderBy: [['nome', 'ASC']],
      },
    );

    return records.map((record) => ({
      id: record.id,
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
        apostila: data.apostila,
        questionario: data.questionario,
      };
    }

    await AuditLogRepository.log(
      {
        entityName: 'cursoAula',
        entityId: record.id,
        action,
        values,
      },
      options,
    );
  }

  /**
   * Fills an array of CursoAula with relations and files.
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
   * Fill the CursoAula with the relations and files.
   *
   * @param {Object} record
   * @param {Object} [options]
   */
  static async _fillWithRelationsAndFiles(record, options: IRepositoryOptions) {
    if (!record) {
      return record;
    }

    const output = record.get({ plain: true });

    const transaction = SequelizeRepository.getTransaction(
      options,
    );

    output.imagem = await FileRepository.fillDownloadUrl(
      await record.getImagem({
        transaction,
      }),
    );
    output.apostila = await FileRepository.fillDownloadUrl(
      await record.getApostila({
        transaction,
      }),
    );
    output.questionario = await FileRepository.fillDownloadUrl(
      await record.getQuestionario({
        transaction,
      }),
    );

    return output;
  }

  static async appFindAndCountAll(id,
    { filter, limit = 0, offset = 0, orderBy = '' },
    options: IRepositoryOptions,
  ) {

    let whereAnd: Array<any> = [];
    let include = [
      {
        model: options.database.cursoModulo,
        as: 'modulo',
      },      
    ];

    whereAnd.push({
      moduloId: id,
    });

    if (filter) {
      if (filter.id) {
        whereAnd.push({
          ['id']: SequelizeFilterUtils.uuid(filter.id),
        });
      }

      if (filter.modulo) {
        whereAnd.push({
          ['moduloId']: SequelizeFilterUtils.uuid(
            filter.modulo,
          ),
        });
      }

      if (filter.nome) {
        whereAnd.push(
          SequelizeFilterUtils.ilike(
            'cursoAula',
            'nome',
            filter.nome,
          ),
        );
      }

      if (filter.descricao) {
        whereAnd.push(
          SequelizeFilterUtils.ilike(
            'cursoAula',
            'descricao',
            filter.descricao,
          ),
        );
      }

      if (filter.url) {
        whereAnd.push(
          SequelizeFilterUtils.ilike(
            'cursoAula',
            'url',
            filter.url,
          ),
        );
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

    let {
      rows,
      count,
    } = await options.database.cursoAula.findAndCountAll({
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
    });

    rows = await this._fillWithRelationsAndFilesForRows(
      rows,
      options,
    );

    return { rows, count };
  }

  static async appFindById(id, options: IRepositoryOptions) {
    const transaction = SequelizeRepository.getTransaction(
      options,
    );

    const include = [
      {
        model: options.database.cursoModulo,
        as: 'modulo',
      },
    ];

    const record = await options.database.cursoAula.findByPk(
      id,
      {
        include,
        transaction,
      },
    );

    return this._fillWithRelationsAndFiles(record, options);
  }
}

export default CursoAulaRepository;
