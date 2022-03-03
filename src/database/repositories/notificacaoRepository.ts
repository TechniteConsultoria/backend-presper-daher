import SequelizeRepository from '../../database/repositories/sequelizeRepository';
import AuditLogRepository from '../../database/repositories/auditLogRepository';
import lodash from 'lodash';
import SequelizeFilterUtils from '../../database/utils/sequelizeFilterUtils';
import Error404 from '../../errors/Error404';
import Sequelize from 'sequelize';
import { IRepositoryOptions } from './IRepositoryOptions';

const Op = Sequelize.Op;

/**
 * Handles database operations for the Notificacao.
 * See https://sequelize.org/v5/index.html to learn how to customize it.
 */
class NotificacaoRepository {
  /**
   * Creates the Notificacao.
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

    if (data.recorrente == 'Sim') {
      let dataInicio = new Date(data.dataDe);
      let hora = new Date(data.horaNotificacao);
      
      dataInicio.setHours(hora.getHours(),
      hora.getMinutes(),
      0)

      let dataAte = new Date(data.dataAte)
      dataAte.setHours(hora.getHours(),
      hora.getMinutes(),
      0)

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
          data.data = dataInicio; 

          const record = await options.database.notificacao.create(
            {
              ...lodash.pick(data, [
                'nome',
                'notificacao',
                'data',          
                'importHash',
                'destinatarios',
                'enviado'
              ]),
              tenantId: tenant.id,
              createdById: currentUser.id,
              updatedById: currentUser.id,
            },
            {
              transaction,
            },
          );
       
          await this._createAuditLog(
            AuditLogRepository.CREATE,
            record,
            data,
            options,
          );
        }
        dataInicio.setDate(dataInicio.getDate() + 1)
      }
      return;
    }
    else {

    const record = await options.database.notificacao.create(
      {
        ...lodash.pick(data, [
          'nome',
          'notificacao',
          'data',          
          'importHash',
          'destinatarios',
          'enviado'
        ]),
        tenantId: tenant.id,
        createdById: currentUser.id,
        updatedById: currentUser.id,
      },
      {
        transaction,
      },
    );
    await this._createAuditLog(
      AuditLogRepository.CREATE,
      record,
      data,
      options,
    );

    return this.findById(record.id, options);
    }
  }

  /**
   * Updates the Notificacao.
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

    let record = await options.database.notificacao.findByPk(
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
          'notificacao',
          'data',          
          'importHash',
          'destinatarios',,
          'enviado'
        ]),
        updatedById: currentUser.id,
      },
      {
        transaction,
      },
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
   * Deletes the Notificacao.
   *
   * @param {string} id
   * @param {Object} [options]
   */
  static async destroy(id, options: IRepositoryOptions) {
    const transaction = SequelizeRepository.getTransaction(
      options,
    );

    let record = await options.database.notificacao.findByPk(
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
   * Finds the Notificacao and its relations.
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

    const record = await options.database.notificacao.findByPk(
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
   * Counts the number of Notificacaos based on the filter.
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

    return options.database.notificacao.count(
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
   * Finds the Notificacaos based on the query.
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

      if (filter.nome) {
        whereAnd.push(
          SequelizeFilterUtils.ilike(
            'notificacao',
            'nome',
            filter.nome,
          ),
        );
      }

      if (filter.notificacao) {
        whereAnd.push(
          SequelizeFilterUtils.ilike(
            'notificacao',
            'notificacao',
            filter.notificacao,
          ),
        );
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
    } = await options.database.notificacao.findAndCountAll({
      where,
      include,
      limit: limit ? Number(limit) : undefined,
      offset: offset ? Number(offset) : undefined,
      order: orderBy
        ? [orderBy.split('_')]
        : [['data', 'ASC']],
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

  static async findAll(idTenant, res,
    options: IRepositoryOptions,
  ) {
    let offset = 0
    let orderBy = '' 

    const tenant = SequelizeRepository.getCurrentTenant(
      options,
    );

    let whereAnd: Array<any> = [];

    whereAnd.push({
      tenantId: idTenant,
    });

    //const where = { [Op.and]: whereAnd };

    let {
      rows
    } = await options.database.notificacao.findAndCountAll({
     // where,
      offset: offset ? Number(offset) : undefined,
      order: orderBy
        ? [orderBy.split('_')]
        : [['data', 'ASC']],
      transaction: SequelizeRepository.getTransaction(
        options,
      ),
    });

    let calendario: any[] = []
    
    rows.forEach(i => {
     calendario.push(
    { id: i.id,
      title: i.nome,
      start: i.data,
      description: i.notificacao
    })
    });

    rows = await this._fillWithRelationsAndFilesForRows(
      rows,
      options,
    );

    if (calendario.length == 0){

     return res.status(401).send({ mensagem: 'não autorizado'});
    }

    return { calendario };
  }


  /**
   * Lists the Notificacaos to populate the autocomplete.
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
              'notificacao',
              'nome',
              query,
            ),
          },
        ],
      };
    }

    const records = await options.database.notificacao.findAll(
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
        entityName: 'notificacao',
        entityId: record.id,
        action,
        values,
      },
      options,
    );
  }

  /**
   * Fills an array of Notificacao with relations and files.
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
   * Fill the Notificacao with the relations and files.
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

export default NotificacaoRepository;
