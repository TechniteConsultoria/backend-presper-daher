import SequelizeRepository from '../../database/repositories/sequelizeRepository';
import AuditLogRepository from '../../database/repositories/auditLogRepository';
import lodash from 'lodash';
import SequelizeFilterUtils from '../../database/utils/sequelizeFilterUtils';
import Error404 from '../../errors/Error404';
import Sequelize from 'sequelize';
import { IRepositoryOptions } from './IRepositoryOptions';
require('dotenv').config();

const Op = Sequelize.Op;

/**
 * Handles database operations for the QuestionarioCliente.
 * See https://sequelize.org/v5/index.html to learn how to customize it.
 */
class QuestionarioClienteRepository {
  /**
   * Creates the QuestionarioCliente.
   *
   * @param {Object} data
   * @param {Object} [options]
   */
  
  static async createOpen(data, options: IRepositoryOptions) {

    const transaction = SequelizeRepository.getTransaction(
      options,
    );

    const record = await options.database.questionarioCliente.create(
      {
        ...lodash.pick(data, [
          'data',          
          'importHash',
        ]),
      },
      {
        transaction,
      },
    );

    await record.setCliente(data.cliente || null, {
      transaction,
    });
    await record.setQuestionario(data.questionario || null, {
      transaction,
    });
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

    static async create(data, options: IRepositoryOptions) {
      const currentUser = SequelizeRepository.getCurrentUser(
        options,
      );
  
      let tenant = SequelizeRepository.getCurrentTenant(
        options,
      );

      let tenantId = process.env.TENANT_ID || ''; 


      if(tenant == null){
        tenant = tenantId;
      }
  
      const transaction = SequelizeRepository.getTransaction(
        options,
      );
  
      const record = await options.database.questionarioCliente.create(
        {
          ...lodash.pick(data, [
            'data',          
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

    await record.setCliente(data.cliente || null, {
      transaction,
    });
    await record.setQuestionario(data.questionario || null, {
      transaction,
    });
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
   * Updates the QuestionarioCliente.
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

    let record = await options.database.questionarioCliente.findByPk(
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
          'data',          
          'importHash',
        ]),
        updatedById: currentUser.id,
      },
      {
        transaction,
      },
    );

    await record.setCliente(data.cliente || null, {
      transaction,
    });
    await record.setQuestionario(data.questionario || null, {
      transaction,
    });
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
   * Deletes the QuestionarioCliente.
   *
   * @param {string} id
   * @param {Object} [options]
   */
  static async destroy(id, options: IRepositoryOptions) {
    const transaction = SequelizeRepository.getTransaction(
      options,
    );

    let record = await options.database.questionarioCliente.findByPk(
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
   * Finds the QuestionarioCliente and its relations.
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
        model: options.database.cliente,
        as: 'cliente',
      },
      {
        model: options.database.questionario,
        as: 'questionario',
      },
    ];

    const record = await options.database.questionarioCliente.findByPk(
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

  static async findByCliente(id, avaliacao, options: IRepositoryOptions) {
    const include = [
      {
        model: options.database.questionario,
        as: 'questionario',
      },
    ];

    const record = await options.database.questionarioCliente.findAll(
      {
        include,
        where: {
          clienteId: id,
          avaliacaoId: avaliacao,
        }
      }
    );

    return record;
  }

  /**
   * Counts the number of QuestionarioClientes based on the filter.
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

    return options.database.questionarioCliente.count(
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
   * Finds the QuestionarioClientes based on the query.
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

     
     static async findAndCountAllOpen(
      { filter, limit = 0, offset = 0, orderBy = '' },
      options: IRepositoryOptions,
    ) {
      const tenant = SequelizeRepository.getCurrentTenant(
        options,
      );
  
      let whereAnd: Array<any> = [];
      let include = [
        {
          model: options.database.cliente,
          as: 'cliente',
        },
        {
          model: options.database.questionario,
          as: 'questionario',
        },
        {
          model: options.database.avaliacao,
          as: 'avaliacao',
        },      
      ];
  
      if (filter) {
  
        if (filter.avaliacao) {
          whereAnd.push({
            ['avaliacaoId']: SequelizeFilterUtils.uuid(
              filter.avaliacao,
            ),
          });
        }
  
        if (filter.cliente) {
          whereAnd.push({
            ['clienteId']: SequelizeFilterUtils.uuid(
              filter.cliente,
            ),
          });
        }
  
        if (filter.questionario) {
          whereAnd.push({
            ['questionarioId']: SequelizeFilterUtils.uuid(
              filter.questionario,
            ),
          });
        }
      }
  
      const where = { [Op.and]: whereAnd };      
  
      let {
        rows,
        count,
      } = await options.database.questionarioCliente.findAndCountAll({
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
          model: options.database.cliente,
          as: 'cliente',
        },
        {
          model: options.database.questionario,
          as: 'questionario',
        },
        {
          model: options.database.avaliacao,
          as: 'avaliacao',
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
  
        if (filter.dataRange) {
          const [start, end] = filter.dataRange;
  
          if (start !== undefined && start !== null && start !== '') {
            whereAnd.push({
              data: {
                [Op.gte]: start,
              },
            });
          }
  
          if (end !== undefined && end !== null && end !== '') {
            whereAnd.push({
              data: {
                [Op.lte]: end,
              },
            });
          }
        }
  
        if (filter.cliente) {
          whereAnd.push({
            ['clienteId']: SequelizeFilterUtils.uuid(
              filter.cliente,
            ),
          });
        }
  
        if (filter.questionario) {
          whereAnd.push({
            ['questionarioId']: SequelizeFilterUtils.uuid(
              filter.questionario,
            ),
          });
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
      } = await options.database.questionarioCliente.findAndCountAll({
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
   * Lists the QuestionarioClientes to populate the autocomplete.
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

        ],
      };
    }

    const records = await options.database.questionarioCliente.findAll(
      {
        attributes: ['id', 'id'],
        where,
        limit: limit ? Number(limit) : undefined,
        orderBy: [['id', 'ASC']],
      },
    );

    return records.map((record) => ({
      id: record.id,
      label: record.id,
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
        entityName: 'questionarioCliente',
        entityId: record.id,
        action,
        values,
      },
      options,
    );
  }

  /**
   * Fills an array of QuestionarioCliente with relations and files.
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
   * Fill the QuestionarioCliente with the relations and files.
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



    return output;
  }
}

export default QuestionarioClienteRepository;
