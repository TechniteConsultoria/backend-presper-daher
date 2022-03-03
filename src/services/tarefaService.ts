import TarefaRepository from '../database/repositories/tarefaRepository';
import Error400 from '../errors/Error400';
import SequelizeRepository from '../database/repositories/sequelizeRepository';
import { IServiceOptions } from './IServiceOptions';

/**
 * Handles Tarefa operations
 */
export default class TarefaService {
  options: IServiceOptions;

  constructor(options) {
    this.options = options;
  }

  /**
   * Creates a Tarefa.
   *
   * @param {*} data
   */
  async create(data) {
    const transaction = await SequelizeRepository.createTransaction(
      this.options.database,
    );

    try {
      const record = await TarefaRepository.create(data, {
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
        'tarefa',
      );

      throw error;
    }
  }

  async createDiasTarefas(data) {
    const transaction = await SequelizeRepository.createTransaction(
      this.options.database,
    );

    try {
      const record = await TarefaRepository.createDiasTarefas(data, {
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
        'tarefa',
      );

      throw error;
    }
  }

  /**
   * Updates a Tarefa.
   *
   * @param {*} id
   * @param {*} data
   */
  async update(id, data) {
    const transaction = await SequelizeRepository.createTransaction(
      this.options.database,
    );

    try {
      const record = await TarefaRepository.update(
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
        'tarefa',
      );

      throw error;
    }
  }

  /**
   * Destroy all Tarefas with those ids.
   *
   * @param {*} ids
   */
  async destroyAll(ids) {
    const transaction = await SequelizeRepository.createTransaction(
      this.options.database,
    );

    try {
      for (const id of ids) {
        await TarefaRepository.destroy(id, {
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
   * Finds the Tarefa by Id.
   *
   * @param {*} id
   */
  async findById(id) {
    return TarefaRepository.findById(id, this.options);
  }

  /**
   * Finds Tarefas for Autocomplete.
   *
   * @param {*} search
   * @param {*} limit
   */
  
  async findAllAutocomplete(search, limit) {
    return TarefaRepository.findAllAutocomplete(
      search,
      limit,
      this.options,
    );
  }

  async findAllAutocompleteDistinct(search, limit) {
    return TarefaRepository.findAllAutocompleteDistinct(
      search,
      limit,
      this.options,
    );
  }
  
  /**
   * Finds Tarefas based on the query.
   *
   * @param {*} args
   */
  async findAndCountAll(args) {
    return TarefaRepository.findAndCountAll(
      args,
      this.options,
    );
  }

  /**
   * Imports a list of Tarefas.
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
    const count = await TarefaRepository.count(
      {
        importHash,
      },
      this.options,
    );

    return count > 0;
  }

  async appFindAndCountAll(id, args) {
    return TarefaRepository.appFindAndCountAll(
      id,
      args,
      this.options,
    );
  }

  async appFindById(id) {
    return TarefaRepository.appFindById(id, this.options);
  }

  async appUpdate(id, data) {
    const transaction = await SequelizeRepository.createTransaction(
      this.options.database,
    );
      
    try {
      const record = await TarefaRepository.appUpdate(
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
        'tarefa',
      );

      throw error;
    }
  }
}
