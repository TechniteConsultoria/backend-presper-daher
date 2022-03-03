import SequelizeRepository from '../../database/repositories/sequelizeRepository';
import AuditLogRepository from '../../database/repositories/auditLogRepository';
import lodash from 'lodash';
import SequelizeFilterUtils from '../../database/utils/sequelizeFilterUtils';
import Error404 from '../../errors/Error404';
import Sequelize from 'sequelize';
import { IRepositoryOptions } from './IRepositoryOptions';
import FileRepository from './fileRepository';
import { getConfig } from '../../config';

const highlight = require('cli-highlight').highlight;

const Op = Sequelize.Op;

/**
 * Handles database operations for the Questionario.
 * See https://sequelize.org/v5/index.html to learn how to customize it.
 */
class QuestionarioRepository {
  /**
   * Creates the Questionario.
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

    const record = await options.database.questionario.create(
      {
        ...lodash.pick(data, [
          'nome',
          'descricao',
          'importHash',
          'liberado',
          'tipoGrafico',
        ]),
        tenantId: tenant.id,
        createdById: currentUser.id,
        updatedById: currentUser.id,
      },
      {
        transaction,
      },
    );

    await record.setTipo(data.tipo || null, {
      transaction,
    });

    await FileRepository.replaceRelationFiles(
      {
        belongsTo: options.database.questionario.getTableName(),
        belongsToColumn: 'uploadPdf',
        belongsToId: record.id,
      },
      data.uploadPdf,
      options,
    );

    await this._createAuditLog(
      AuditLogRepository.CREATE,
      record,
      data,
      options,
    );
    if (record.dataValues.liberado == 'Sim') {
      let idQuestionario = record.dataValues.id;
      

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
      const { QueryTypes } = require('sequelize');
      const questionariosDisc = await seq.query(
        'INSERT INTO avaliacaoquestionarioquestionario ' +
          '(avaliacaoId,questionarioId, createdAt, updatedAt) ' +
          " SELECT x.primeira,  '" +
          idQuestionario +
          "', now(), now() FROM ( " +
          " SELECT a.id, SUM(CASE WHEN c.questionarioId = '" +
          idQuestionario +
          "' THEN 1 ELSE 0 END)  as qtd,  " +
          ' b.id as primeira  ' +
          '  FROM clientes as a  ' +
          '  JOIN avaliacaos b ON a.id = b.clienteId ' +
          ' LEFT JOIN avaliacaoquestionarioquestionario c ON b.id = c.avaliacaoId ' +
          '  WHERE a.deletedAt is null ' +
          ' AND b.deletedAt is null ' +
          ' GROUP BY a.id) x  ' +
          '  WHERE x.qtd = 0;',
        { type: QueryTypes.INSERT },
      );
    }

    return this.findById(record.id, options);
  }

  /**
   * Updates the Questionario.
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
    );

    const transaction = SequelizeRepository.getTransaction(
      options,
    );

    let record = await options.database.questionario.findByPk(
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
          'tipoGrafico',
          'importHash',
          'liberado',
        ]),
        updatedById: currentUser.id,
      },
      {
        transaction,
      },
    );

    await record.setTipo(data.tipo || null, {
      transaction,
    });

    await FileRepository.replaceRelationFiles(
      {
        belongsTo: options.database.questionario.getTableName(),
        belongsToColumn: 'uploadPdf',
        belongsToId: record.id,
      },
      data.uploadPdf,
      options,
    );

    await this._createAuditLog(
      AuditLogRepository.UPDATE,
      record,
      data,
      options,
    );

    if (data.liberado == 'Sim') {
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
      const { QueryTypes } = require('sequelize');

      const questionariosDisc = await seq.query(
        'INSERT INTO avaliacaoquestionarioquestionario ' +
          '(avaliacaoId,questionarioId, createdAt, updatedAt) ' +
          " SELECT x.primeira,  '" +
          id +
          "', now(), now() FROM ( " +
          " SELECT a.id, SUM(CASE WHEN c.questionarioId = '" +
          id +
          "' THEN 1 ELSE 0 END)  as qtd,  " +
          ' b.id as primeira ' +
          ' FROM clientes as a ' +
          ' JOIN avaliacaos b ON a.id = b.clienteId ' +
          ' LEFT JOIN avaliacaoquestionarioquestionario c ON b.id = c.avaliacaoId ' +
          ' WHERE a.deletedAt is null ' +
          ' AND b.deletedAt is null ' +
          ' GROUP BY a.id) x ' +
          ' WHERE x.qtd = 0;',
        { type: QueryTypes.INSERT },
      );
    }

    return this.findById(record.id, options);
  }

  /**
   * Deletes the Questionario.
   *
   * @param {string} id
   * @param {Object} [options]
   */
  static async destroy(id, options: IRepositoryOptions) {
    const transaction = SequelizeRepository.getTransaction(
      options,
    );

    let record = await options.database.questionario.findByPk(
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
   * Finds the Questionario and its relations.
   *
   * @param {string} id
   * @param {Object} [options]
   */

  static async findByIdOpen(
    id,
    options: IRepositoryOptions,
  ) {
    const transaction = SequelizeRepository.getTransaction(
      options,
    );

    const include = [
      {
        model: options.database.questionarioTipo,
        as: 'tipo',
      },
      {
        model: options.database.file,
        as: 'uploadPdf',
      },
    ];

    const record = await options.database.questionario.findByPk(
      id,
      {
        include,
        transaction,
      },
    );

    return this._fillWithRelationsAndFiles(record, options);
  }

  static async findById(id, options: IRepositoryOptions) {
    const transaction = SequelizeRepository.getTransaction(
      options,
    );

    const include = [
      {
        model: options.database.questionarioTipo,
        as: 'tipo',
      },
      {
        model: options.database.file,
        as: 'uploadPdf',
      },
    ];

    const record = await options.database.questionario.findByPk(
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
   * Counts the number of Questionarios based on the filter.
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

    return options.database.questionario.count(
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
   * Finds the Questionarios based on the query.
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
        model: options.database.questionarioTipo,
        as: 'tipo',
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

      if (filter.tipo) {
        whereAnd.push({
          ['tipoId']: SequelizeFilterUtils.uuid(
            filter.tipo,
          ),
        });
      }

      if (filter.nome) {
        whereAnd.push(
          SequelizeFilterUtils.ilike(
            'questionario',
            'nome',
            filter.nome,
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
    } = await options.database.questionario.findAndCountAll(
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
    );

    rows = await this._fillWithRelationsAndFilesForRows(
      rows,
      options,
    );

    return { rows, count };
  }

  /**
   * Lists the Questionarios to populate the autocomplete.
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
              'questionario',
              'nome',
              query,
            ),
          },
        ],
      };
    }

    const records = await options.database.questionario.findAll(
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
      };
    }

    await AuditLogRepository.log(
      {
        entityName: 'questionario',
        entityId: record.id,
        action,
        values,
      },
      options,
    );
  }

  /**
   * Fills an array of Questionario with relations and files.
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
   * Fill the Questionario with the relations and files.
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

    const transaction = SequelizeRepository.getTransaction(
      options,
    );

    return output;
  }
}

export default QuestionarioRepository;
