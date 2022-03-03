import AvaliacaoRepository from '../database/repositories/avaliacaoRepository';
import Error400 from '../errors/Error400';
import SequelizeRepository from '../database/repositories/sequelizeRepository';
import { IServiceOptions } from './IServiceOptions';

/**
 * Handles Avaliacao operations
 */
export default class AvaliacaoService {
  options: IServiceOptions;

  constructor(options) {
    this.options = options;
  }

  /**
   * Creates a Avaliacao.
   *
   * @param {*} data
   */
  
  async criarImc(data) {
    const transaction = await SequelizeRepository.createTransaction(
      this.options.database,
    );

    try {
      const record = await AvaliacaoRepository.criarImc(data, {
        ...this.options,
        transaction,
      });

      await SequelizeRepository.commitTransaction(
        transaction,
      );

      return record;
    } catch (error) {
      await SequelizeRepository.rollbackTransaction(
        transaction,
      );

      SequelizeRepository.handleUniqueFieldError(
        error,
        this.options.language,
        'avaliacao',
      );

      throw error;
    }
  }

  
  async create(data) {
    const transaction = await SequelizeRepository.createTransaction(
      this.options.database,
    );

    try {
      const record = await AvaliacaoRepository.create(data, {
        ...this.options,
        transaction,
      });

      await SequelizeRepository.commitTransaction(
        transaction,
      );

      return record;
    } catch (error) {
      await SequelizeRepository.rollbackTransaction(
        transaction,
      );

      SequelizeRepository.handleUniqueFieldError(
        error,
        this.options.language,
        'avaliacao',
      );

      throw error;
    }
  }

  /**
   * Updates a Avaliacao.
   *
   * @param {*} id
   * @param {*} data
   */
  async update(id, data) {
    const transaction = await SequelizeRepository.createTransaction(
      this.options.database,
    );

    try {
      const record = await AvaliacaoRepository.update(
        id,
        data,
        {
          ...this.options,
          transaction,
        },
      );

      await SequelizeRepository.commitTransaction(
        transaction,
      );

      return record;
    } catch (error) {
      await SequelizeRepository.rollbackTransaction(
        transaction,
      );

      SequelizeRepository.handleUniqueFieldError(
        error,
        this.options.language,
        'avaliacao',
      );

      throw error;
    }
  }

  /**
   * Destroy all Avaliacaos with those ids.
   *
   * @param {*} ids
   */
  async destroyAll(ids) {
    const transaction = await SequelizeRepository.createTransaction(
      this.options.database,
    );

    try {
      for (const id of ids) {
        await AvaliacaoRepository.destroy(id, {
          ...this.options,
          transaction,
        });
      }

      await SequelizeRepository.commitTransaction(
        transaction,
      );
    } catch (error) {
      await SequelizeRepository.rollbackTransaction(
        transaction,
      );
      throw error;
    }
  }

  /**
   * Finds the Avaliacao by Id.
   *
   * @param {*} id
   */
  async findById(id) {
    return AvaliacaoRepository.findById(id, this.options);
  }

  /**
   * Finds Avaliacaos for Autocomplete.
   *
   * @param {*} search
   * @param {*} limit
   */
  async findAllAutocomplete(search, limit) {
    return AvaliacaoRepository.findAllAutocomplete(
      search,
      limit,
      this.options,
    );
  }

  /**
   * Finds Avaliacaos based on the query.
   *
   * @param {*} args
   */
  async findAndCountAll(args) {
    return AvaliacaoRepository.findAndCountAll(
      args,
      this.options,
    );
  }

  /**
   * Imports a list of Avaliacaos.
   *
   * @param {*} data
   * @param {*} importHash
   */
  async import(data, importHash) {
    if (!importHash) {
      throw new Error400(
        this.options.language,
        'importer.errors.importHashRequired',
      );
    }

    if (await this._isImportHashExistent(importHash)) {
      throw new Error400(
        this.options.language,
        'importer.errors.importHashExistent',
      );
    }

    const dataToCreate = {
      ...data,
      importHash,
    };

    return this.create(dataToCreate);
  }

  /**
   * Checks if the import hash already exists.
   * Every item imported has a unique hash.
   *
   * @param {*} importHash
   */
  async _isImportHashExistent(importHash) {
    const count = await AvaliacaoRepository.count(
      {
        importHash,
      },
      this.options,
    );

    return count > 0;
  }
  
  async findAvaliacaoQuestionario(id, args) {
    return AvaliacaoRepository.findAvaliacaoQuestionario(id,
      this.options,
    );
  }
  async appFindImc(id, args) {
    return AvaliacaoRepository.appFindImc(id,
      this.options,
    );
  }

  async appFindImcNull(id, args) {
    return AvaliacaoRepository.appFindImcNull(id,
      this.options,
    );
  }

  async appFindDisc(idAvaliacao, idQuestionario, idCliente, args) {
    return AvaliacaoRepository.appFindDisc(idAvaliacao, idQuestionario, idCliente,
      this.options,
    );
  }

  async appFindRodaVida(idAvaliacao, idQuestionario, idCliente, args) {
    return AvaliacaoRepository.appFindRodaVida(idAvaliacao, idQuestionario, idCliente,
      this.options,
    );
  }

  async appFindEscalaCor(idAvaliacao, idQuestionario, idCliente, args) {
    return AvaliacaoRepository.appFindEscalaCor(idAvaliacao, idQuestionario, idCliente,
      this.options,
    );
  }

  async appFindAndCountAll(id, args) {
    return AvaliacaoRepository.appFindAndCountAll(id,
      args,
      this.options,
    );
  }

  async appFindById(id) {
    return AvaliacaoRepository.appFindById(id, this.options);
  }

  async appFindAndCountAllPendentes(id) {
    return AvaliacaoRepository.appFindAndCountAllPendentes(id,
      this.options,
    );
  }

  async appDietaFindAndCountAll(id, args) {
    return AvaliacaoRepository.appDietaFindAndCountAll(id,
      args,
      this.options,
    );
  }

  async appBioimpedanciaFindAndCountAll(id, args) {
    return AvaliacaoRepository.appBioimpedanciaFindAndCountAll(id,
      args,
      this.options,
    );
  }

  async appBioressonanciaFindAndCountAll(id, args) {
    return AvaliacaoRepository.appBioressonanciaFindAndCountAll(id,
      args,
      this.options,
    );
  }

  
}
