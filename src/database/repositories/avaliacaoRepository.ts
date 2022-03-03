import SequelizeRepository from '../../database/repositories/sequelizeRepository';
import AuditLogRepository from '../../database/repositories/auditLogRepository';
import lodash from 'lodash';
import SequelizeFilterUtils from '../../database/utils/sequelizeFilterUtils';
import Error404 from '../../errors/Error404';
import Sequelize from 'sequelize';
import FileRepository from './fileRepository';
import { IRepositoryOptions } from './IRepositoryOptions';
import moment from 'moment';
import { getConfig } from '../../config';
import { any } from 'sequelize/types/lib/operators';
require('dotenv').config();

const highlight = require('cli-highlight').highlight;
const Op = Sequelize.Op;

/**
 * Handles database operations for the Avaliacao.
 * See https://sequelize.org/v5/index.html to learn how to customize it.
 */
class AvaliacaoRepository {
  /**
   * Creates the Avaliacao.
   *
   * @param {Object} data
   * @param {Object} [options]
   */

  static async criarImc(data, options: IRepositoryOptions) {
    const currentUser = SequelizeRepository.getCurrentUser(
      options,
    );

    const transaction = SequelizeRepository.getTransaction(
      options,
    );

    let tenantId = process.env.TENANT_ID || '';

    const idTenant = tenantId;

    const record = await options.database.avaliacao.create(
      {
        ...lodash.pick(data, [
          'data',
          'peso',
          'altura',
          'imc',
        ]),
        tenantId: idTenant,
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

    // return this.findById(record.id, options);
  }

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

    //Vínculo com questionários padrão (Nutricionista)
    const questionariosNutri = await options.database.questionario.findAll(
      {
        where: {
          liberado: 'Nutricionista'
        }
      }
    )

    questionariosNutri.forEach(e => {
      data.questionario.push(e.dataValues.id)
    });
    
    // if(data.tarefas){
    //   data.tarefas = data.tarefas.join();
    // }
    

    const record = await options.database.avaliacao.create(
      {
        ...lodash.pick(data, [
          'data',
          'dataBioimpedancia',
          'dataBioressonancia',
          'peso',
          'altura',
          'imc',
          // 'tarefas',
          'diarioNutricional',
          'diasTarefa',
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

    await record.setQuestionario(data.questionario || [], {
      transaction,
    });

    await FileRepository.replaceRelationFiles(
      {
        belongsTo: options.database.avaliacao.getTableName(),
        belongsToColumn: 'dieta',
        belongsToId: record.id,
      },
      data.dieta,
      options,
    );
    await FileRepository.replaceRelationFiles(
      {
        belongsTo: options.database.avaliacao.getTableName(),
        belongsToColumn: 'bioimpedancia',
        belongsToId: record.id,
      },
      data.bioimpedancia,
      options,
    );
    await FileRepository.replaceRelationFiles(
      {
        belongsTo: options.database.avaliacao.getTableName(),
        belongsToColumn: 'bioressonancia',
        belongsToId: record.id,
      },
      data.bioressonancia,
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
   * Updates the Avaliacao.
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

    let record = await options.database.avaliacao.findByPk(
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
    
    let tarefa;
    let tarefaArray = new Array();
    let tarefaArrayFinal;

    // if(data.tarefas){
    //   data.tarefas.forEach(element => {
    //     tarefa = JSON.stringify(element);
    //     tarefaArray.push(tarefa);
    //     // data.tarefas.join()
    //   });
    //   tarefaArrayFinal = `[${tarefaArray.toString()}]`;
    //   // console.log(typeof(tarefaArray))
    // }

    record = await record.update(
      {
        ...lodash.pick(data, [
          'data',
          'dataBioimpedancia',
          'dataBioressonancia',
          'peso',
          'altura',
          'imc',
          'diarioNutricional',
          'diasTarefa',
          'importHash',
        ]),
        // tarefas: tarefaArrayFinal,
        updatedById: currentUser.id,
      },
      {
        transaction,
      },
    );

    await record.setCliente(data.cliente || null, {
      transaction,
    });

    await record.setQuestionario(data.questionario || [], {
      transaction,
    });


    await FileRepository.replaceRelationFiles(
      {
        belongsTo: options.database.avaliacao.getTableName(),
        belongsToColumn: 'dieta',
        belongsToId: record.id,
      },
      data.dieta,
      options,
    );
    await FileRepository.replaceRelationFiles(
      {
        belongsTo: options.database.avaliacao.getTableName(),
        belongsToColumn: 'bioimpedancia',
        belongsToId: record.id,
      },
      data.bioimpedancia,
      options,
    );
    await FileRepository.replaceRelationFiles(
      {
        belongsTo: options.database.avaliacao.getTableName(),
        belongsToColumn: 'bioressonancia',
        belongsToId: record.id,
      },
      data.bioressonancia,
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
   * Deletes the Avaliacao.
   *
   * @param {string} id
   * @param {Object} [options]
   */
  static async destroy(id, options: IRepositoryOptions) {
    const transaction = SequelizeRepository.getTransaction(
      options,
    );

    let record = await options.database.avaliacao.findByPk(
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
   * Finds the Avaliacao and its relations.
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
      {
        model: options.database.tarefa,
        as: 'tarefa',
      }
    ];

    const record = await options.database.avaliacao.findByPk(
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
    
    // if(record.tarefas){
    //   if (record.tarefas != null && record.tarefas != '') {
    //     record.tarefas = record.tarefas.split(',');
    //   }
    // }

    let obj = await this._fillWithRelationsAndFiles(
      record,
      options,
    );

    obj.questionario.forEach((e) => {
      e.respondido = true;
    });

    let pendentes = await this.appFindAndCountAllPendentes(
      obj.cliente.id,
      options,
    );

    pendentes.forEach((e) => {
      if (e.avaliacaoId != obj.id) {
        pendentes.splice(e, 1);
      }
    });

    obj.questionario.forEach((e) => {
      pendentes.forEach((f) => {
        if (f.questionarioId == e.id) e.respondido = false;
      });
    });

    return obj;
  }

  /**
   * Counts the number of Avaliacaos based on the filter.
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

    return options.database.avaliacao.count(
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
   * Finds the Avaliacaos based on the query.
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
        model: options.database.cliente,
        as: 'cliente',
      },
      {
        model: options.database.questionario,
        as: 'questionario',
      }
    ];

    whereAnd.push({
      tenantId: tenant.id,
    });

    const currentUser = SequelizeRepository.getCurrentUser(
      options,
    );
    if (currentUser.usuarioMaster != 'Sim') {
      if (currentUser.afiliadoId == null) {
        whereAnd.push({
          ['id']: currentUser.id,
        });
      } else {
        const transaction = SequelizeRepository.getTransaction(
          options,
        );
        let regiao = await options.database.user.findAll({
          where: {
            afiliadoId: currentUser.afiliadoId,
          },
          transaction,
        });

        let users = '';
        regiao.forEach((element) => {
          users += ';' + element.id + ';';
        });

        let usersValidado: string[] = [];
        users.split(';').forEach((element) => {
          if (element != '') {
            usersValidado.push(element);
          }
        });

        const Op = Sequelize.Op;
        whereAnd.push({
          createdById: {
            [Op.in]: usersValidado,
          },
        });
      }
    }

    if (filter) {
      if (filter.id) {
        whereAnd.push({
          ['id']: SequelizeFilterUtils.uuid(filter.id),
        });
      }

      if (filter.cliente) {
        whereAnd.push({
          ['clienteId']: SequelizeFilterUtils.uuid(
            filter.cliente,
          ),
        });
      }

      if (filter.dataRange) {
        const [start, end] = filter.dataRange;

        if (
          start !== undefined &&
          start !== null &&
          start !== ''
        ) {
          whereAnd.push({
            data: {
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
            data: {
              [Op.lte]: end,
            },
          });
        }
      }

      if (filter.dataBioimpedanciaRange) {
        const [start, end] = filter.dataBioimpedanciaRange;

        if (
          start !== undefined &&
          start !== null &&
          start !== ''
        ) {
          whereAnd.push({
            dataBioimpedancia: {
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
            dataBioimpedancia: {
              [Op.lte]: end,
            },
          });
        }
      }

      if (filter.dataBioressonanciaRange) {
        const [start, end] = filter.dataBioressonanciaRange;

        if (
          start !== undefined &&
          start !== null &&
          start !== ''
        ) {
          whereAnd.push({
            dataBioressonancia: {
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
            dataBioressonancia: {
              [Op.lte]: end,
            },
          });
        }
      }

      if (filter.pesoRange) {
        const [start, end] = filter.pesoRange;

        if (
          start !== undefined &&
          start !== null &&
          start !== ''
        ) {
          whereAnd.push({
            peso: {
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
            peso: {
              [Op.lte]: end,
            },
          });
        }
      }

      if (filter.alturaRange) {
        const [start, end] = filter.alturaRange;

        if (
          start !== undefined &&
          start !== null &&
          start !== ''
        ) {
          whereAnd.push({
            altura: {
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
            altura: {
              [Op.lte]: end,
            },
          });
        }
      }

      if (filter.imcRange) {
        const [start, end] = filter.imcRange;

        if (
          start !== undefined &&
          start !== null &&
          start !== ''
        ) {
          whereAnd.push({
            imc: {
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
            imc: {
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
    } = await options.database.avaliacao.findAndCountAll({
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
   * Lists the Avaliacaos to populate the autocomplete.
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

    const currentUser = SequelizeRepository.getCurrentUser(
      options,
    );
    if (currentUser.usuarioMaster != 'Sim') {
      if (currentUser.afiliadoId == null) {
        where = {
          ['id']: currentUser.id,
        };
      } else {
        const transaction = SequelizeRepository.getTransaction(
          options,
        );
        let regiao = await options.database.user.findAll({
          where: {
            afiliadoId: currentUser.afiliadoId,
          },
          transaction,
        });

        let users = '';
        regiao.forEach((element) => {
          users += ';' + element.id + ';';
        });

        let usersValidado: string[] = [];
        users.split(';').forEach((element) => {
          if (element != '') {
            usersValidado.push(element);
          }
        });

        const Op = Sequelize.Op;
        where = {
          createdById: {
            [Op.in]: usersValidado,
          },
        };
      }
    }

    if (query) {
      where = {
        ...where,
        [Op.or]: [
          { ['id']: SequelizeFilterUtils.uuid(query) },
        ],
      };
    }

    const records = await options.database.avaliacao.findAll(
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
        dieta: data.dieta,
        questionarioIds: data.questionario,
        bioimpedancia: data.bioimpedancia,
        bioressonancia: data.bioressonancia,
      };
    }

    await AuditLogRepository.log(
      {
        entityName: 'avaliacao',
        entityId: record.id,
        action,
        values,
      },
      options,
    );
  }

  /**
   * Fills an array of Avaliacao with relations and files.
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
   * Fill the Avaliacao with the relations and files.
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

    /* output.questionario = await record.getQuestionario({
      transaction,
    }); */

    output.dieta = await FileRepository.fillDownloadUrl(
      await record.getDieta({
        transaction,
      }),
    );
    output.bioimpedancia = await FileRepository.fillDownloadUrl(
      await record.getBioimpedancia({
        transaction,
      }),
    );
    output.bioressonancia = await FileRepository.fillDownloadUrl(
      await record.getBioressonancia({
        transaction,
      }),
    );

    return output;
  }

  //Rotas do App
  //Avaliações

  static async findAvaliacaoQuestionario(
    id,
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
    );
    const { QueryTypes } = require('sequelize');

    const questionariosDisc = await seq.query(
      'SELECT distinct a.nome,e.id as avaliacao,a.id as questionario,e.data  from questionarios a ' +
        'JOIN questionarioTipos b ON a.tipoId = b.id ' +
        'JOIN questionarioClientes c ON a.id = c.questionarioId ' +
        'JOIN avaliacaoQuestionarioQuestionario d ON d.questionarioId = a.id ' +
        'JOIN avaliacaos e ON e.id = d.avaliacaoId ' +
        "WHERE c.clienteId =  '" +
        id +
        "' " +
        "" +
        "AND a.liberado != 'Nutricionista' " +
        "AND b.nome = 'DISC' " +
        'AND a.deletedAt is null ' +
        'AND b.deletedAt is null ' +
        'AND c.deletedAt is null ' +
        'AND e.deletedAt is null ' +
        'ORDER by e.data DESC ',
      { type: QueryTypes.SELECT },
    );
    return questionariosDisc;
  }

  static async appFindRodaVida(
    idAvaliacao,
    idQuestionario,
    idCliente,
    options: IRepositoryOptions,
  ) {
    const perguntas = await options.database.questionarioPergunta.findAndCountAll(
      {
        where: {
          ['questionarioId']: idQuestionario,
        },
        order: [['ordem', 'ASC']],
        transaction: SequelizeRepository.getTransaction(
          options,
        ),
      },
    );

    let arrayIdPerguntas = new Array();
    let arrayPerguntas = new Array();
    perguntas.rows.forEach((element) => {
      arrayIdPerguntas.push(element['id']);
      arrayPerguntas.push({
        id: element['id'],
        ordem: element['ordem'],
        tipoDisc: element['tipoDisc'],
      });
    });

    const questionarioCliente = await options.database.questionarioCliente.findAndCountAll(
      {
        where: {
          avaliacaoId: idAvaliacao,
          clienteId: idCliente,
          questionarioId: idQuestionario,
        },
        transaction: SequelizeRepository.getTransaction(
          options,
        ),
      },
    );

    let idQuestionarioCliente =
      questionarioCliente.rows[0]['id'];

    const respostas = await options.database.questionarioClienteResposta.findAndCountAll(
      {
        where: {
          perguntaId: { [Op.in]: arrayIdPerguntas },
          questionarioClienteId: idQuestionarioCliente,
        },
        order: [['ordem', 'ASC']],
        transaction: SequelizeRepository.getTransaction(
          options,
        ),
      },
    );

    let rodaVida = new Array();
    let rodaVida2 = new Array();
    let saude;
    let profissao;
    let financas;
    let familia;
    let lazer;

    let arrayRespostas = new Array();
    respostas.rows.forEach(async (pergunta) => {
      arrayPerguntas.forEach((paramPergunta) => {
        if (paramPergunta['id'] == pergunta['perguntaId']) {
          arrayRespostas.push(pergunta);
          if (
            isNaN(pergunta['respostaEscala']) === false &&
            pergunta['respostaEscala'] != null
          ) {
            rodaVida.push(pergunta['respostaEscala']);
          }
          if (paramPergunta['ordem'] == '5') {
            saude = parseInt(pergunta['respostaEscala']);
          }
          if (paramPergunta['ordem'] == '3') {
            profissao = parseInt(
              pergunta['respostaEscala'],
            );
          }
          if (paramPergunta['ordem'] == '4') {
            financas = parseInt(pergunta['respostaEscala']);
          }
          if (paramPergunta['ordem'] == '9') {
            familia = parseInt(pergunta['respostaEscala']);
          }
          if (paramPergunta['ordem'] == '11') {
            lazer = parseInt(pergunta['respostaEscala']);
          }
        }
      });
    });

    let resultado =
      saude + profissao + financas + familia + lazer;

    let saudeFinal = ((saude * 100) / resultado).toFixed(2);
    let profissaoFinal = ((profissao * 100) / resultado).toFixed(2);
    let financasFinal = ((financas * 100) / resultado).toFixed(2);
    let familiaFinal = ((familia * 100) / resultado).toFixed(2);
    let lazerFinal = ((lazer * 100) / resultado).toFixed(2);

    rodaVida2.push(saude);
    rodaVida2.push(profissao);
    rodaVida2.push(financas);
    rodaVida2.push(familia);
    rodaVida2.push(lazer);

    return {
      rodaVida,
      rodaVida2,
      saude: saudeFinal,
      profissao: profissaoFinal,
      financas: financasFinal,
      familia: familiaFinal,
      lazer: lazerFinal,
    };
  }

  static async appFindDisc(
    idAvaliacao,
    idQuestionario,
    idCliente,
    options: IRepositoryOptions,
  ) {
    const perguntas = await options.database.questionarioPergunta.findAndCountAll(
      {
        where: {
          ['questionarioId']: idQuestionario,
        },
        order: [['ordem', 'ASC']],
        transaction: SequelizeRepository.getTransaction(
          options,
        ),
      },
    );

    let arrayIdPerguntas = new Array();
    let arrayPerguntas = new Array();
    perguntas.rows.forEach((element) => {
      arrayIdPerguntas.push(element['id']);
      arrayPerguntas.push({
        id: element['id'],
        ordem: element['ordem'],
        tipoDisc: element['tipoDisc'],
      });
    });

    const questionarioCliente = await options.database.questionarioCliente.findAndCountAll(
      {
        where: {
          avaliacaoId: idAvaliacao,
          clienteId: idCliente,
          questionarioId: idQuestionario,
        },
        transaction: SequelizeRepository.getTransaction(
          options,
        ),
      },
    );

    let idQuestionarioCliente =
      questionarioCliente.rows[0]['id'];

    const respostas = await options.database.questionarioClienteResposta.findAndCountAll(
      {
        where: {
          perguntaId: { [Op.in]: arrayIdPerguntas },
          questionarioClienteId: idQuestionarioCliente,
        },
        order: [['ordem', 'ASC']],
        transaction: SequelizeRepository.getTransaction(
          options,
        ),
      },
    );

    let D = 0;
    let I = 0;
    let S = 0;
    let C = 0;
    let disc = new Array();

    let arrayRespostas = new Array();
    respostas.rows.forEach((pergunta) => {
      arrayPerguntas.forEach((paramPergunta) => {
        if (paramPergunta['id'] == pergunta['perguntaId']) {
          arrayRespostas.push(pergunta);
          if (paramPergunta['tipoDisc'] == 'Somar') {
            D = D + parseInt(pergunta['respostaDisc1']);
            I = I + parseInt(pergunta['respostaDisc2']);
            S = S + parseInt(pergunta['respostaDisc3']);
            C = C + parseInt(pergunta['respostaDisc4']);
          }

          if (paramPergunta['tipoDisc'] == 'Subtrair') {
            D = D - parseInt(pergunta['respostaDisc1']);
            I = I - parseInt(pergunta['respostaDisc2']);
            S = S - parseInt(pergunta['respostaDisc3']);
            C = C - parseInt(pergunta['respostaDisc4']);
          }
        }
      });
    });

    disc.push(D);
    disc.push(I);
    disc.push(S);
    disc.push(C);

    return { disc };
  }

  static async appFindEscalaCor(
    idAvaliacao,
    idQuestionario,
    idCliente,
    options: IRepositoryOptions,
  ) {
    const perguntas = await options.database.questionarioPergunta.findAndCountAll(
      {
        where: {
          ['questionarioId']: idQuestionario,
        },
        order: [['ordem', 'ASC']],
        transaction: SequelizeRepository.getTransaction(
          options,
        ),
      },
    );

    let arrayIdPerguntas = new Array();
    let arrayPerguntas = new Array();
    perguntas.rows.forEach((element) => {
      arrayIdPerguntas.push(element['id']);
      arrayPerguntas.push({
        id: element['id'],
        ordem: element['ordem'],
        tamanhoEscala: element['tamanhoEscala'],
      });
    });

    const questionarioCliente = await options.database.questionarioCliente.findAndCountAll(
      {
        where: {
          avaliacaoId: idAvaliacao,
          clienteId: idCliente,
          questionarioId: idQuestionario,
        },
        transaction: SequelizeRepository.getTransaction(
          options,
        ),
      },
    );

    let idQuestionarioCliente =
      questionarioCliente.rows[0]['id'];

    const respostas = await options.database.questionarioClienteResposta.findAndCountAll(
      {
        where: {
          perguntaId: { [Op.in]: arrayIdPerguntas },
          questionarioClienteId: idQuestionarioCliente,
        },
        order: [['ordem', 'ASC']],
        transaction: SequelizeRepository.getTransaction(
          options,
        ),
      },
    );

    let verde = 0;
    let vermelho = 0;
    let amarelo = 0;
    let escalaCor = new Array();

    let arrayRespostas = new Array();
    respostas.rows.forEach((resposta) => {
      arrayPerguntas.forEach((paramPergunta) => {
        if (paramPergunta['id'] == resposta['perguntaId']) {
          arrayRespostas.push(resposta);
          if (paramPergunta['tamanhoEscala'] == '3') {
            if (resposta['respostaEscala'] == 1) {
              vermelho++;
            }
            if (resposta['respostaEscala'] == 2) {
              amarelo++;
            }
            if (resposta['respostaEscala'] == 3) {
              verde++;
            }
          }
        }
      });
    });

    escalaCor.push(verde);
    escalaCor.push(vermelho);
    escalaCor.push(amarelo);

    return { escalaCor };
  }

  static async appFindImcNull(
    id,
    options: IRepositoryOptions,
  ) {
    let whereAnd: Array<any> = [];
    let include = [
      {
        model: options.database.cliente,
        as: 'cliente',
      },
      {
        model: options.database.questionario,
        as: 'questionario',
        where: {
          liberado : {
            [Op.notLike]: '%Nutricionista%'
          }
        }
      }
    ];

    let avaliacoes = await options.database.avaliacao.findAndCountAll(
      {
        where: {
          ['clienteId']: id,
          peso: {
            [Op.ne]: null,
          },
          altura: {
            [Op.ne]: null,
          },
          imc: {
            [Op.ne]: null,
          },
        },
        include,
        order: [['createdAt', 'ASC']],
        transaction: SequelizeRepository.getTransaction(
          options,
        ),
      },
    );

    if (avaliacoes['count'] > 0) {
      return {
        message: 'não permitido',
      };
    }
    whereAnd.push({
      ['clienteId']: id,
    });

    whereAnd.push({
      peso: {
        [Op.eq]: null,
      },
    });

    whereAnd.push({
      altura: {
        [Op.eq]: null,
      },
    });

    whereAnd.push({
      imc: {
        [Op.eq]: null,
      },
    });

    const where = { [Op.and]: whereAnd };

    let {
      rows,
      count,
    } = await options.database.avaliacao.findAndCountAll({
      where,
      include,
      order: [['createdAt', 'ASC']],
      limit: 1,
      offset: 0,
      transaction: SequelizeRepository.getTransaction(
        options,
      ),
    });

    rows = await this._fillWithRelationsAndFilesForRows(
      rows,
      options,
    );

    if (count > 0) {
      return {
        message: 'permitido',
      };
    }
  }

  static async appFindImc(id, options: IRepositoryOptions) {
    //? START IMC
    let whereAndImc: Array<any> = [];
    let include = [
      {
        model: options.database.cliente,
        as: 'cliente',
      },
      {
        model: options.database.questionario,
        as: 'questionario',
        where: {
          liberado : {
            [Op.notLike]: '%Nutricionista%'
          }
        }
      }
    ];

    whereAndImc.push({
      ['clienteId']: id,
    });

    whereAndImc.push({
      peso: {
        [Op.ne]: null,
      },
    });

    whereAndImc.push({
      altura: {
        [Op.ne]: null,
      },
    });

    whereAndImc.push({
      imc: {
        [Op.ne]: null,
      },
    });

    const whereImc = { [Op.and]: whereAndImc };

    let {
      rows,
      count,
    } = await options.database.avaliacao.findAndCountAll({
      where: whereImc,
      include,
      order: [['data', 'ASC']],
      transaction: SequelizeRepository.getTransaction(
        options,
      ),
    });

    rows = await this._fillWithRelationsAndFilesForRows(
      rows,
      options,
    );

    let idCliente = '';
    let imc = new Array();
    let datas = new Array();

    rows.forEach((element) => {
      if (idCliente == '') {
        idCliente = element['cliente']['id'];
      }
      imc.push(element['imc']);
      let data = moment(element['data']).format(
        'DD/MM/YYYY',
      );
      datas.push(data);
    });

    let imcResult = { imc, datas, idCliente };
    //? END IMC

    //?START QUESTIONARIOS GERAIS
    let include2 = [
      {
        model: options.database.questionario,
        as: 'questionario',
        where: { tipoGrafico: { [Op.ne]: null } },
      },
    ];

    let whereAll = whereAndImc;
    whereAll.splice(1, 3);

    const where = { [Op.and]: whereAll };

    let avaliacoes = await options.database.avaliacao.findAndCountAll(
      {
        where,
        include: include2,
        order: [['data', 'ASC']],
        transaction: SequelizeRepository.getTransaction(
          options,
        ),
      },
    );

    //?END QUESTIONARIOS GERAIS
    let perfilComportamental = new Array();
    let cor = new Array();
    let rodaVida = new Array();

    avaliacoes.rows.forEach((avaliacao) => {
      avaliacao.questionario.forEach(
        (questionario, index) => {
          let idListagem =
            index +
            Math.random()
              .toString(36)
              .replace(/[^a-z]+/g, '')
              .substr(0, 6);
          //?START QUESTIONARIO DE PERFIL COMPORTAMENTAL
          if (
            questionario['tipoGrafico'] ==
            'perfilComportamental'
          ) {
            perfilComportamental.push({
              id: idListagem,
              idQuestionario: questionario.id,
              idAvaliacao: avaliacao.id,
              nome: questionario.nome,
            });
          }
          //?END QUESTIONARIO DE PERFIL COMPORTAMENTAL
          //?START QUESTIONARIO DE COR
          if (questionario['tipoGrafico'] == 'cor') {
            cor.push({
              id: idListagem,
              idQuestionario: questionario.id,
              idAvaliacao: avaliacao.id,
              nome: questionario.nome,
            });
          }
          //?END QUESTIONARIO DE COR
          //?START QUESTIONARIO DE RODA DA VIDA
          if (questionario['tipoGrafico'] == 'rodaVida') {
            rodaVida.push({
              id: idListagem,
              idQuestionario: questionario.id,
              idAvaliacao: avaliacao.id,
              nome: questionario.nome,
            });
          }
          //?END QUESTIONARIO DE RODA DA VIDA
        },
      );
    });

    return {
      imcResult,
      perfilComportamental,
      cor,
      rodaVida,
    };
  }

  static async appFindAndCountAll(
    id,
    { filter, limit = 0, offset = 0, orderBy = '' },
    options: IRepositoryOptions,
  ) {
    let whereAnd: Array<any> = [];
    let include = [
      {
        model: options.database.cliente,
        as: 'cliente',
      },
      {
        model: options.database.questionario,
        as: 'questionario',
        where: {
          liberado : {
            [Op.notLike]: '%Nutricionista%'
          }
        }
      },
      {
        model: options.database.tarefa,
        as: 'tarefa',
      }
    ];

    whereAnd.push({
      ['clienteId']: id,
    });

    if (filter) {
      if (filter.id) {
        whereAnd.push({
          ['id']: SequelizeFilterUtils.uuid(filter.id),
        });
      }

      if (filter.dataRange) {
        const [start, end] = filter.dataRange;

        if (
          start !== undefined &&
          start !== null &&
          start !== ''
        ) {
          whereAnd.push({
            data: {
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
            data: {
              [Op.lte]: end,
            },
          });
        }
      }

      if (filter.dataBioimpedanciaRange) {
        const [start, end] = filter.dataBioimpedanciaRange;

        if (
          start !== undefined &&
          start !== null &&
          start !== ''
        ) {
          whereAnd.push({
            dataBioimpedancia: {
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
            dataBioimpedancia: {
              [Op.lte]: end,
            },
          });
        }
      }

      if (filter.dataBioressonanciaRange) {
        const [start, end] = filter.dataBioressonanciaRange;

        if (
          start !== undefined &&
          start !== null &&
          start !== ''
        ) {
          whereAnd.push({
            dataBioressonancia: {
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
            dataBioressonancia: {
              [Op.lte]: end,
            },
          });
        }
      }

      if (filter.pesoRange) {
        const [start, end] = filter.pesoRange;

        if (
          start !== undefined &&
          start !== null &&
          start !== ''
        ) {
          whereAnd.push({
            peso: {
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
            peso: {
              [Op.lte]: end,
            },
          });
        }
      }

      if (filter.alturaRange) {
        const [start, end] = filter.alturaRange;

        if (
          start !== undefined &&
          start !== null &&
          start !== ''
        ) {
          whereAnd.push({
            altura: {
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
            altura: {
              [Op.lte]: end,
            },
          });
        }
      }

      if (filter.imcRange) {
        const [start, end] = filter.imcRange;

        if (
          start !== undefined &&
          start !== null &&
          start !== ''
        ) {
          whereAnd.push({
            imc: {
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
            imc: {
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
    } = await options.database.avaliacao.findAndCountAll({
      where,
      include,
      limit: limit ? Number(limit) : undefined,
      offset: offset ? Number(offset) : undefined,
      order: [['data', 'ASC']],
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

  static async appFindById(
    id,
    options: IRepositoryOptions,
  ) {
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
        where: {
          liberado : {
            [Op.notLike]: '%Nutricionista%'
          }
        }
      }
    ];

    const record = await options.database.avaliacao.findByPk(
      id,
      {
        include,
        transaction,
      },
    );

    return this._fillWithRelationsAndFiles(record, options);
  }

  static async appFindAndCountAllPendentes(
    id,
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
    );
    const { QueryTypes } = require('sequelize');

    const questionariosPendentes = await seq.query(
      'SELECT y.avaliacaoId, y.questionarioId, c.nome ' +
        'FROM' +
        '(' +
        'SELECT x.avaliacaoId, x.questionarioId ' +
        'FROM' +
        '(' +
        'SELECT DISTINCT a.* ' +
        'FROM avaliacaoQuestionarioQuestionario a ' +
        'LEFT JOIN questionarioClientes b ' +
        'ON a.avaliacaoId = b.avaliacaoId ' +
        'WHERE a.avaliacaoId IN ( ' +
        'SELECT id ' +
        'FROM avaliacaos ' +
        'WHERE clienteId = ' +
        "'" +
        id +
        "' " +
        'AND deletedAt is null ) ' +
        ') as x ' +
        'LEFT JOIN questionarioClientes b ' +
        'ON (x.avaliacaoId = b.avaliacaoId AND x.questionarioId = b.questionarioId) ' +
        'WHERE b.id IS NULL' +
        ') as y ' +
        "JOIN questionarios c ON y.questionarioId = c.id AND c.deletedat IS NULL AND c.liberado != 'Nutricionista'",
      { type: QueryTypes.SELECT },
    );
    return questionariosPendentes;
  }

  //Bioimpedância
  static async appBioimpedanciaFindAndCountAll(
    id,
    { filter, limit = 0, offset = 0, orderBy = '' },
    options: IRepositoryOptions,
  ) {
    let whereAnd: Array<any> = [];
    let include = [
      {
        model: options.database.cliente,
        as: 'cliente',
      },
    ];

    whereAnd.push({
      ['clienteId']: id,
    });

    if (filter) {
      if (filter.id) {
        whereAnd.push({
          ['id']: SequelizeFilterUtils.uuid(filter.id),
        });
      }

      if (filter.dataRange) {
        const [start, end] = filter.dataRange;

        if (
          start !== undefined &&
          start !== null &&
          start !== ''
        ) {
          whereAnd.push({
            data: {
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
            data: {
              [Op.lte]: end,
            },
          });
        }
      }

      if (filter.dataBioimpedanciaRange) {
        const [start, end] = filter.dataBioimpedanciaRange;

        if (
          start !== undefined &&
          start !== null &&
          start !== ''
        ) {
          whereAnd.push({
            dataBioimpedancia: {
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
            dataBioimpedancia: {
              [Op.lte]: end,
            },
          });
        }
      }

      if (filter.dataBioressonanciaRange) {
        const [start, end] = filter.dataBioressonanciaRange;

        if (
          start !== undefined &&
          start !== null &&
          start !== ''
        ) {
          whereAnd.push({
            dataBioressonancia: {
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
            dataBioressonancia: {
              [Op.lte]: end,
            },
          });
        }
      }

      if (filter.pesoRange) {
        const [start, end] = filter.pesoRange;

        if (
          start !== undefined &&
          start !== null &&
          start !== ''
        ) {
          whereAnd.push({
            peso: {
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
            peso: {
              [Op.lte]: end,
            },
          });
        }
      }

      if (filter.alturaRange) {
        const [start, end] = filter.alturaRange;

        if (
          start !== undefined &&
          start !== null &&
          start !== ''
        ) {
          whereAnd.push({
            altura: {
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
            altura: {
              [Op.lte]: end,
            },
          });
        }
      }

      if (filter.imcRange) {
        const [start, end] = filter.imcRange;

        if (
          start !== undefined &&
          start !== null &&
          start !== ''
        ) {
          whereAnd.push({
            imc: {
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
            imc: {
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
    } = await options.database.avaliacao.findAndCountAll({
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

    rows = await this._bioimpedanciaFillWithRelationsAndFilesForRows(
      rows,
      options,
    );

    let bioimpedancias = new Array();

    rows.forEach((bioimpedancia) => {
      bioimpedancias.push(bioimpedancia.bioimpedancia);
    });

    let pdfs = new Object({ url: '', nome: '', data: '' });
    let stringPdf = JSON.stringify(pdfs);
    let jsonPdf = JSON.parse(stringPdf);

    let jsonArrayPdf = new Array();

    for (let i = 0; i < bioimpedancias.length; i++) {
      for (let j = 0; j < bioimpedancias[i].length; j++) {
        jsonPdf.url = bioimpedancias[i][j].downloadUrl;
        jsonPdf.nome = bioimpedancias[i][j].name;
        jsonPdf.data = bioimpedancias[i][j].createdAt;
        jsonArrayPdf.push(jsonPdf);

        pdfs = new Object(pdfs);
        stringPdf = JSON.stringify(pdfs);
        jsonPdf = JSON.parse(stringPdf);
      }
    }

    let count = jsonArrayPdf.length;

    return { jsonArrayPdf, count };
  }

  //Bioressonancia
  static async appBioressonanciaFindAndCountAll(
    id,
    { filter, limit = 0, offset = 0, orderBy = '' },
    options: IRepositoryOptions,
  ) {
    let whereAnd: Array<any> = [];
    let include = [
      {
        model: options.database.cliente,
        as: 'cliente',
      },
    ];

    whereAnd.push({
      ['clienteId']: id,
    });

    if (filter) {
      if (filter.id) {
        whereAnd.push({
          ['id']: SequelizeFilterUtils.uuid(filter.id),
        });
      }

      if (filter.dataRange) {
        const [start, end] = filter.dataRange;

        if (
          start !== undefined &&
          start !== null &&
          start !== ''
        ) {
          whereAnd.push({
            data: {
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
            data: {
              [Op.lte]: end,
            },
          });
        }
      }

      if (filter.dataBioimpedanciaRange) {
        const [start, end] = filter.dataBioimpedanciaRange;

        if (
          start !== undefined &&
          start !== null &&
          start !== ''
        ) {
          whereAnd.push({
            dataBioimpedancia: {
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
            dataBioimpedancia: {
              [Op.lte]: end,
            },
          });
        }
      }

      if (filter.dataBioressonanciaRange) {
        const [start, end] = filter.dataBioressonanciaRange;

        if (
          start !== undefined &&
          start !== null &&
          start !== ''
        ) {
          whereAnd.push({
            dataBioressonancia: {
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
            dataBioressonancia: {
              [Op.lte]: end,
            },
          });
        }
      }

      if (filter.pesoRange) {
        const [start, end] = filter.pesoRange;

        if (
          start !== undefined &&
          start !== null &&
          start !== ''
        ) {
          whereAnd.push({
            peso: {
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
            peso: {
              [Op.lte]: end,
            },
          });
        }
      }

      if (filter.alturaRange) {
        const [start, end] = filter.alturaRange;

        if (
          start !== undefined &&
          start !== null &&
          start !== ''
        ) {
          whereAnd.push({
            altura: {
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
            altura: {
              [Op.lte]: end,
            },
          });
        }
      }

      if (filter.imcRange) {
        const [start, end] = filter.imcRange;

        if (
          start !== undefined &&
          start !== null &&
          start !== ''
        ) {
          whereAnd.push({
            imc: {
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
            imc: {
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
    } = await options.database.avaliacao.findAndCountAll({
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

    rows = await this._bioressonanciaFillWithRelationsAndFilesForRows(
      rows,
      options,
    );

    let bioressonancias = new Array();

    rows.forEach((bioressonancia) => {
      bioressonancias.push(bioressonancia.bioressonancia);
    });

    let pdfs = new Object({ url: '', nome: '', data: '' });
    let stringPdf = JSON.stringify(pdfs);
    let jsonPdf = JSON.parse(stringPdf);

    let jsonArrayPdf = new Array();

    for (let i = 0; i < bioressonancias.length; i++) {
      for (let j = 0; j < bioressonancias[i].length; j++) {
        jsonPdf.url = bioressonancias[i][j].downloadUrl;
        jsonPdf.nome = bioressonancias[i][j].name;
        jsonPdf.data = bioressonancias[i][j].createdAt;
        jsonArrayPdf.push(jsonPdf);

        pdfs = new Object(pdfs);
        stringPdf = JSON.stringify(pdfs);
        jsonPdf = JSON.parse(stringPdf);
      }
    }

    let count = jsonArrayPdf.length;

    return { jsonArrayPdf, count };
  }

  //Dietas
  static async appDietaFindAndCountAll(
    id,
    { filter, limit = 0, offset = 0, orderBy = '' },
    options: IRepositoryOptions,
  ) {
    let whereAnd: Array<any> = [];
    let include = [
      {
        model: options.database.cliente,
        as: 'cliente',
      },
    ];

    whereAnd.push({
      ['clienteId']: id,
    });

    if (filter) {
      if (filter.id) {
        whereAnd.push({
          ['id']: SequelizeFilterUtils.uuid(filter.id),
        });
      }

      if (filter.dataRange) {
        const [start, end] = filter.dataRange;

        if (
          start !== undefined &&
          start !== null &&
          start !== ''
        ) {
          whereAnd.push({
            data: {
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
            data: {
              [Op.lte]: end,
            },
          });
        }
      }

      if (filter.dataBioimpedanciaRange) {
        const [start, end] = filter.dataBioimpedanciaRange;

        if (
          start !== undefined &&
          start !== null &&
          start !== ''
        ) {
          whereAnd.push({
            dataBioimpedancia: {
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
            dataBioimpedancia: {
              [Op.lte]: end,
            },
          });
        }
      }

      if (filter.dataBioressonanciaRange) {
        const [start, end] = filter.dataBioressonanciaRange;

        if (
          start !== undefined &&
          start !== null &&
          start !== ''
        ) {
          whereAnd.push({
            dataBioressonancia: {
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
            dataBioressonancia: {
              [Op.lte]: end,
            },
          });
        }
      }

      if (filter.pesoRange) {
        const [start, end] = filter.pesoRange;

        if (
          start !== undefined &&
          start !== null &&
          start !== ''
        ) {
          whereAnd.push({
            peso: {
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
            peso: {
              [Op.lte]: end,
            },
          });
        }
      }

      if (filter.alturaRange) {
        const [start, end] = filter.alturaRange;

        if (
          start !== undefined &&
          start !== null &&
          start !== ''
        ) {
          whereAnd.push({
            altura: {
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
            altura: {
              [Op.lte]: end,
            },
          });
        }
      }

      if (filter.imcRange) {
        const [start, end] = filter.imcRange;

        if (
          start !== undefined &&
          start !== null &&
          start !== ''
        ) {
          whereAnd.push({
            imc: {
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
            imc: {
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
    } = await options.database.avaliacao.findAndCountAll({
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

    rows = await this._dietasFillWithRelationsAndFilesForRows(
      rows,
      options,
    );

    let dietas = new Array();

    rows.forEach((dieta) => {
      dietas.push(dieta.dieta);
    });

    let pdfs = new Object({ url: '', nome: '', data: '' });
    let stringPdf = JSON.stringify(pdfs);
    let jsonPdf = JSON.parse(stringPdf);

    let jsonArrayPdf = new Array();

    for (let i = 0; i < dietas.length; i++) {
      for (let j = 0; j < dietas[i].length; j++) {
        jsonPdf.url = dietas[i][j].downloadUrl;
        jsonPdf.nome = dietas[i][j].name;
        jsonPdf.data = dietas[i][j].createdAt;
        jsonArrayPdf.push(jsonPdf);

        pdfs = new Object(pdfs);
        stringPdf = JSON.stringify(pdfs);
        jsonPdf = JSON.parse(stringPdf);
      }
    }

    let count = jsonArrayPdf.length;

    return { jsonArrayPdf, count };
  }

  //Arquivos

  //Bioimpedâncias
  static async _bioimpedanciaFillWithRelationsAndFilesForRows(
    rows,
    options: IRepositoryOptions,
  ) {
    if (!rows) {
      return rows;
    }

    return Promise.all(
      rows.map((record) =>
        this._bioimpedanciaFillWithRelationsAndFiles(
          record,
          options,
        ),
      ),
    );
  }

  static async _bioimpedanciaFillWithRelationsAndFiles(
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

    output.bioimpedancia = await FileRepository.fillDownloadUrl(
      await record.getBioimpedancia({
        transaction,
      }),
    );

    return output;
  }

  //Bioressonâncias
  static async _bioressonanciaFillWithRelationsAndFilesForRows(
    rows,
    options: IRepositoryOptions,
  ) {
    if (!rows) {
      return rows;
    }

    return Promise.all(
      rows.map((record) =>
        this._bioressonanciaFillWithRelationsAndFiles(
          record,
          options,
        ),
      ),
    );
  }

  static async _bioressonanciaFillWithRelationsAndFiles(
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

    output.bioressonancia = await FileRepository.fillDownloadUrl(
      await record.getBioressonancia({
        transaction,
      }),
    );

    return output;
  }

  //Dietas
  static async _dietasFillWithRelationsAndFilesForRows(
    rows,
    options: IRepositoryOptions,
  ) {
    if (!rows) {
      return rows;
    }

    return Promise.all(
      rows.map((record) =>
        this._dietaFillWithRelationsAndFiles(
          record,
          options,
        ),
      ),
    );
  }

  static async _dietaFillWithRelationsAndFiles(
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

    output.dieta = await FileRepository.fillDownloadUrl(
      await record.getDieta({
        transaction,
      }),
    );

    return output;
  }

  static async _pendentesFillWithRelationsAndFilesForRows(
    rows,
    options: IRepositoryOptions,
  ) {
    if (!rows) {
      return rows;
    }

    return Promise.all(
      rows.map((record) =>
        this._pendentesFillWithRelationsAndFiles(
          record,
          options,
        ),
      ),
    );
  }

  static async _pendentesFillWithRelationsAndFiles(
    record,
    options: IRepositoryOptions,
  ) {
    if (!record) {
      return record;
    }

    const output = record.get({ plain: true });

    return output;
  }
}

export default AvaliacaoRepository;
