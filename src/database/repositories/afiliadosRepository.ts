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
 * Handles database operations for the Afiliados.
 * See https://sequelize.org/v5/index.html to learn how to customize it.
 */
class AfiliadosRepository {
  /**
   * Creates the Afiliados.
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

    const record = await options.database.afiliados.create(
      {
        ...lodash.pick(data, [
          'tipoPessoa',
          'documento',
          'nome',
          'nomeFantasia',
          'cep',
          'uf',
          'cidade',
          'bairro',
          'logradouro',
          'numero',
          'complemento',
          'ativo',          
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


  
    await FileRepository.replaceRelationFiles(
      {
        belongsTo: options.database.afiliados.getTableName(),
        belongsToColumn: 'foto',
        belongsToId: record.id,
      },
      data.foto,
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
   * Updates the Afiliados.
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

    let record = await options.database.afiliados.findByPk(
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
          'tipoPessoa',
          'documento',
          'nome',
          'nomeFantasia',
          'cep',
          'uf',
          'cidade',
          'bairro',
          'logradouro',
          'numero',
          'complemento',
          'ativo',          
          'importHash',
        ]),
        updatedById: currentUser.id,
      },
      {
        transaction,
      },
    );



    await FileRepository.replaceRelationFiles(
      {
        belongsTo: options.database.afiliados.getTableName(),
        belongsToColumn: 'foto',
        belongsToId: record.id,
      },
      data.foto,
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
   * Deletes the Afiliados.
   *
   * @param {string} id
   * @param {Object} [options]
   */
  static async destroy(id, options: IRepositoryOptions) {
    const transaction = SequelizeRepository.getTransaction(
      options,
    );

    let record = await options.database.afiliados.findByPk(
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
   * Finds the Afiliados and its relations.
   *
   * @param {string} id
   * @param {Object} [options]
   */
  static async findById(id, options: IRepositoryOptions) {
    const transaction = SequelizeRepository.getTransaction(
      options,
    );

    const include = [

    ];

    const record = await options.database.afiliados.findByPk(
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
   * Counts the number of Afiliadoss based on the filter.
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

    return options.database.afiliados.count(
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
   * Finds the Afiliadoss based on the query.
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

      if (filter.tipoPessoa) {
        whereAnd.push({
          tipoPessoa: filter.tipoPessoa,
        });
      }

      if (filter.documentoRange) {
        const [start, end] = filter.documentoRange;

        if (start !== undefined && start !== null && start !== '') {
          whereAnd.push({
            documento: {
              [Op.gte]: start,
            },
          });
        }

        if (end !== undefined && end !== null && end !== '') {
          whereAnd.push({
            documento: {
              [Op.lte]: end,
            },
          });
        }
      }

      if (filter.nome) {
        whereAnd.push(
          SequelizeFilterUtils.ilike(
            'afiliados',
            'nome',
            filter.nome,
          ),
        );
      }

      if (filter.nomeFantasia) {
        whereAnd.push(
          SequelizeFilterUtils.ilike(
            'afiliados',
            'nomeFantasia',
            filter.nomeFantasia,
          ),
        );
      }

      if (filter.cepRange) {
        const [start, end] = filter.cepRange;

        if (start !== undefined && start !== null && start !== '') {
          whereAnd.push({
            cep: {
              [Op.gte]: start,
            },
          });
        }

        if (end !== undefined && end !== null && end !== '') {
          whereAnd.push({
            cep: {
              [Op.lte]: end,
            },
          });
        }
      }

      if (filter.uf) {
        whereAnd.push(
          SequelizeFilterUtils.ilike(
            'afiliados',
            'uf',
            filter.uf,
          ),
        );
      }

      if (filter.cidade) {
        whereAnd.push(
          SequelizeFilterUtils.ilike(
            'afiliados',
            'cidade',
            filter.cidade,
          ),
        );
      }

      if (filter.bairro) {
        whereAnd.push(
          SequelizeFilterUtils.ilike(
            'afiliados',
            'bairro',
            filter.bairro,
          ),
        );
      }

      if (filter.logradouro) {
        whereAnd.push(
          SequelizeFilterUtils.ilike(
            'afiliados',
            'logradouro',
            filter.logradouro,
          ),
        );
      }

      if (filter.numeroRange) {
        const [start, end] = filter.numeroRange;

        if (start !== undefined && start !== null && start !== '') {
          whereAnd.push({
            numero: {
              [Op.gte]: start,
            },
          });
        }

        if (end !== undefined && end !== null && end !== '') {
          whereAnd.push({
            numero: {
              [Op.lte]: end,
            },
          });
        }
      }

      if (filter.complemento) {
        whereAnd.push(
          SequelizeFilterUtils.ilike(
            'afiliados',
            'complemento',
            filter.complemento,
          ),
        );
      }

      if (filter.ativo) {
        whereAnd.push({
          ativo: filter.ativo,
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
    } = await options.database.afiliados.findAndCountAll({
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
   * Lists the Afiliadoss to populate the autocomplete.
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
              'afiliados',
              'nomeFantasia',
              query,
            ),
          },
        ],
      };
    }

    const records = await options.database.afiliados.findAll(
      {
        attributes: ['id', 'nomeFantasia'],
        where,
        limit: limit ? Number(limit) : undefined,
        orderBy: [['nomeFantasia', 'ASC']],
      },
    );

    return records.map((record) => ({
      id: record.id,
      label: record.nomeFantasia,
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
        foto: data.foto,
      };
    }

    await AuditLogRepository.log(
      {
        entityName: 'afiliados',
        entityId: record.id,
        action,
        values,
      },
      options,
    );
  }

  /**
   * Fills an array of Afiliados with relations and files.
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
   * Fill the Afiliados with the relations and files.
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

    output.foto = await FileRepository.fillDownloadUrl(
      await record.getFoto({
        transaction,
      }),
    );

    return output;
  }
}

export default AfiliadosRepository;
