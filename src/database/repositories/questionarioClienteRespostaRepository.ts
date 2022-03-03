import SequelizeRepository from '../../database/repositories/sequelizeRepository';
import AuditLogRepository from '../../database/repositories/auditLogRepository';
import lodash from 'lodash';
import SequelizeFilterUtils from '../../database/utils/sequelizeFilterUtils';
import Error404 from '../../errors/Error404';
import Sequelize from 'sequelize';
import { IRepositoryOptions } from './IRepositoryOptions';
import { getConfig } from '../../config';
import { v4 as uuid } from 'uuid';

const Op = Sequelize.Op;

const highlight = require('cli-highlight').highlight;

/**
 * Handles database operations for the QuestionarioClienteResposta.
 * See https://sequelize.org/v5/index.html to learn how to customize it.
 */
class QuestionarioClienteRespostaRepository {
  /**
   * Creates the QuestionarioClienteResposta.
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

    const record = await options.database.questionarioClienteResposta.create(
      {
        ...lodash.pick(data, [
          'respostaPergunta',
          'respostaPerguntaSim',
          'respostaPerguntaNao',
          'respostaDisc1',
          'respostaDisc2',
          'respostaDisc3',
          'respostaDisc4',
          'respostaEscala',          
          'importHash',
          'ordem',
          'respostaEscalaTipo'
        ]),
        tenantId: tenant.id,
        createdById: currentUser.id,
        updatedById: currentUser.id,
      },
      {
        transaction,
      },
    );

    await record.setQuestionarioCliente(data.questionarioCliente || null, {
      transaction,
    });
    await record.setPergunta(data.pergunta || null, {
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

  static async createRespostas(data, options: IRepositoryOptions) {


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
   
    let respostaEscalaInt; 
    if(data.respostaEscala != ''){
      respostaEscalaInt = Number(data.respostaEscala)
    }else{
      respostaEscalaInt = null;
    }

    let dataCreated = data.createdAt.split(".")
    let dataSalvar = dataCreated[0]

    let dataUpdate = data.updatedAt.split(".")
    let dataUpdateSalvar = dataUpdate[0]
    let id = uuid();
    
    let dados = await seq.query("INSERT INTO `questionarioclienteresposta`"+
    "(`id`,`respostaPergunta`,`respostaPerguntaSim`,`respostaPerguntaNao`,`respostaDisc1`,"+
    "`respostaDisc2`,`respostaDisc3`,`respostaDisc4`,`respostaEscala`,`ordem`,`respostaEscalaTipo`,"+
    "`questionarioClienteId`, `createdAt`, `updatedAt`, `perguntaId`)"+
    "VALUES"+
    "('"+id+"',"+
    "'"+data.respostaPergunta+"',"+
    "'"+data.respostaPerguntaSim+"',"+
    "'"+data.respostaPerguntaNao+"',"+
    data.respostaDisc1+","+
    data.respostaDisc2+","+
    data.respostaDisc3+","+
    data.respostaDisc4+","+
    respostaEscalaInt+","+
    data.ordem+","+
    "'"+data.respostaEscalaTipo+"',"+
    "'"+data.questionarioClienteId+"',"+
    "'"+dataSalvar+"',"+
    "'"+dataUpdateSalvar+"',"+
    "'"+data.perguntaId+"');",
      { type: QueryTypes.INSERT }); 

    //console.log('teste')
    /* return this.findById(record.id, options); */
  }

  /**
   * Updates the QuestionarioClienteResposta.
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

    let record = await options.database.questionarioClienteResposta.findByPk(
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
          'respostaPergunta',
          'respostaPerguntaSim',
          'respostaPerguntaNao',
          'respostaDisc1',
          'respostaDisc2',
          'respostaDisc3',
          'respostaDisc4',
          'respostaEscala',          
          'importHash',
          'ordem', 
          'respostaEscalaTipo'
        ]),
        updatedById: currentUser.id,
      },
      {
        transaction,
      },
    );

   /*  await record.setQuestionarioCliente(data.questionarioCliente || null, {
      transaction,
    }); */
   /*  await record.setPergunta(data.pergunta || null, {
      transaction,
    }); */



    await this._createAuditLog(
      AuditLogRepository.UPDATE,
      record,
      data,
      options,
    );

    return this.findById(record.id, options);
  }

  /**
   * Deletes the QuestionarioClienteResposta.
   *
   * @param {string} id
   * @param {Object} [options]
   */
  
  static async destroyOpen(id, options: IRepositoryOptions) {
    const transaction = SequelizeRepository.getTransaction(
      options,
    );

    let record = await options.database.questionarioClienteResposta.findByPk(
      id,
      {
        transaction,
      },
    );  

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

  static async destroy(id, options: IRepositoryOptions) {
    const transaction = SequelizeRepository.getTransaction(
      options,
    );

    let record = await options.database.questionarioClienteResposta.findByPk(
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
   * Finds the QuestionarioClienteResposta and its relations.
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
        model: options.database.questionarioCliente,
        as: 'questionarioCliente',
      },
      {
        model: options.database.questionarioPergunta,
        as: 'pergunta',
      },
    ];

    const record = await options.database.questionarioClienteResposta.findByPk(
      id,
      {
        include,
        transaction,
      },
    );

    const tenant = SequelizeRepository.getCurrentTenant(
      options,
    );

   

    return this._fillWithRelationsAndFiles(record, options);
  }

  /**
   * Counts the number of QuestionarioClienteRespostas based on the filter.
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

    return options.database.questionarioClienteResposta.count(
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
   * Finds the QuestionarioClienteRespostas based on the query.
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
    let whereAnd: Array<any> = [];
    let include = [
      {
        model: options.database.questionarioCliente,
        as: 'questionarioCliente',
      },
      {
        model: options.database.questionarioPergunta,
        as: 'pergunta',
      },      
    ];

    if (filter) {
      if (filter.questionarioClienteId) {
        whereAnd.push({
          ['questionarioClienteId']: SequelizeFilterUtils.uuid(
            filter.questionarioClienteId,
          ),
        });
      }
    }

    const where = { [Op.and]: whereAnd };

    let {
      rows,
      count,
    } = await options.database.questionarioClienteResposta.findAndCountAll({
      where,
      include,
      limit: limit ? Number(limit) : undefined,
      offset: offset ? Number(offset) : undefined,
      order: orderBy
        ? [orderBy.split('_')]
        : [['ordem', 'ASC']],
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
        model: options.database.questionarioCliente,
        as: 'questionarioCliente',
      },
      {
        model: options.database.questionarioPergunta,
        as: 'pergunta',
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

      if (filter.questionarioCliente) {
        whereAnd.push({
          ['questionarioClienteId']: SequelizeFilterUtils.uuid(
            filter.questionarioCliente,
          ),
        });
      }

      if (filter.pergunta) {
        whereAnd.push({
          ['perguntaId']: SequelizeFilterUtils.uuid(
            filter.pergunta,
          ),
        });
      }

      if (filter.respostaPergunta) {
        whereAnd.push(
          SequelizeFilterUtils.ilike(
            'questionarioClienteResposta',
            'respostaPergunta',
            filter.respostaPergunta,
          ),
        );
      }

      if (filter.respostaPerguntaSim) {
        whereAnd.push(
          SequelizeFilterUtils.ilike(
            'questionarioClienteResposta',
            'respostaPerguntaSim',
            filter.respostaPerguntaSim,
          ),
        );
      }

      if (filter.respostaPerguntaNao) {
        whereAnd.push(
          SequelizeFilterUtils.ilike(
            'questionarioClienteResposta',
            'respostaPerguntaNao',
            filter.respostaPerguntaNao,
          ),
        );
      }

      if (filter.respostaDisc1Range) {
        const [start, end] = filter.respostaDisc1Range;

        if (start !== undefined && start !== null && start !== '') {
          whereAnd.push({
            respostaDisc1: {
              [Op.gte]: start,
            },
          });
        }

        if (end !== undefined && end !== null && end !== '') {
          whereAnd.push({
            respostaDisc1: {
              [Op.lte]: end,
            },
          });
        }
      }

      if (filter.respostaDisc2Range) {
        const [start, end] = filter.respostaDisc2Range;

        if (start !== undefined && start !== null && start !== '') {
          whereAnd.push({
            respostaDisc2: {
              [Op.gte]: start,
            },
          });
        }

        if (end !== undefined && end !== null && end !== '') {
          whereAnd.push({
            respostaDisc2: {
              [Op.lte]: end,
            },
          });
        }
      }

      if (filter.respostaDisc3Range) {
        const [start, end] = filter.respostaDisc3Range;

        if (start !== undefined && start !== null && start !== '') {
          whereAnd.push({
            respostaDisc3: {
              [Op.gte]: start,
            },
          });
        }

        if (end !== undefined && end !== null && end !== '') {
          whereAnd.push({
            respostaDisc3: {
              [Op.lte]: end,
            },
          });
        }
      }

      if (filter.respostaDisc4Range) {
        const [start, end] = filter.respostaDisc4Range;

        if (start !== undefined && start !== null && start !== '') {
          whereAnd.push({
            respostaDisc4: {
              [Op.gte]: start,
            },
          });
        }

        if (end !== undefined && end !== null && end !== '') {
          whereAnd.push({
            respostaDisc4: {
              [Op.lte]: end,
            },
          });
        }
      }

      if (filter.respostaEscalaRange) {
        const [start, end] = filter.respostaEscalaRange;

        if (start !== undefined && start !== null && start !== '') {
          whereAnd.push({
            respostaEscala: {
              [Op.gte]: start,
            },
          });
        }

        if (end !== undefined && end !== null && end !== '') {
          whereAnd.push({
            respostaEscala: {
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
    } = await options.database.questionarioClienteResposta.findAndCountAll({
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
   * Lists the QuestionarioClienteRespostas to populate the autocomplete.
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

    const records = await options.database.questionarioClienteResposta.findAll(
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
        entityName: 'questionarioClienteResposta',
        entityId: record.id,
        action,
        values,
      },
      options,
    );
  }

  /**
   * Fills an array of QuestionarioClienteResposta with relations and files.
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
   * Fill the QuestionarioClienteResposta with the relations and files.
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

export default QuestionarioClienteRespostaRepository;
