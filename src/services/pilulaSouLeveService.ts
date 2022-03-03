import PilulaSouLeveRepository from '../database/repositories/pilulaSouLeveRepository';
import Error400 from '../errors/Error400';
import SequelizeRepository from '../database/repositories/sequelizeRepository';
import { IServiceOptions } from './IServiceOptions';

/**
 * Handles PilulaSouLeve operations
 */
export default class PilulaSouLeveService {
  options: IServiceOptions;

  constructor(options) {
    this.options = options;
  }

  /**
   * Creates a PilulaSouLeve.
   *
   * @param {*} data
   */
  async create(data) {
    const transaction = await SequelizeRepository.createTransaction(
      this.options.database,
    );

    try {
      const record = await PilulaSouLeveRepository.create(data, {
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
        'pilulaSouLeve',
      );

      throw error;
    }
  }

  /**
   * Updates a PilulaSouLeve.
   *
   * @param {*} id
   * @param {*} data
   */
  async update(id, data) {
    const transaction = await SequelizeRepository.createTransaction(
      this.options.database,
    );

    try {
      const record = await PilulaSouLeveRepository.update(
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
        'pilulaSouLeve',
      );

      throw error;
    }
  }

  /**
   * Destroy all PilulaSouLeves with those ids.
   *
   * @param {*} ids
   */
  async destroyAll(ids) {
    const transaction = await SequelizeRepository.createTransaction(
      this.options.database,
    );

    try {
      for (const id of ids) {
        await PilulaSouLeveRepository.destroy(id, {
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
   * Finds the PilulaSouLeve by Id.
   *
   * @param {*} id
   */
  async findById(id) {
    return PilulaSouLeveRepository.findById(id, this.options);
  }

  /**
   * Finds PilulaSouLeves for Autocomplete.
   *
   * @param {*} search
   * @param {*} limit
   */
  async findAllAutocomplete(search, limit) {
    return PilulaSouLeveRepository.findAllAutocomplete(
      search,
      limit,
      this.options,
    );
  }

  /**
   * Finds PilulaSouLeves based on the query.
   *
   * @param {*} args
   */
  async findAndCountAll(args) {
    return PilulaSouLeveRepository.findAndCountAll(
      args,
      this.options,
    );
  }

  /**
   * Imports a list of PilulaSouLeves.
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
    const count = await PilulaSouLeveRepository.count(
      {
        importHash,
      },
      this.options,
    );

    return count > 0;
  }

  //Rotas App
  async appFindAndCountAll(args, id, token) {
    return PilulaSouLeveRepository.appFindAndCountAll(
      args,
      this.options,
      id,
      token
    );
  }

  async appFindById(id) {
    return PilulaSouLeveRepository.appFindById(id, this.options);
  }
}
