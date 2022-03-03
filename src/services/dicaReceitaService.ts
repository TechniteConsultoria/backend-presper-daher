import DicaReceitaRepository from '../database/repositories/dicaReceitaRepository';
import Error400 from '../errors/Error400';
import SequelizeRepository from '../database/repositories/sequelizeRepository';
import { IServiceOptions } from './IServiceOptions';

/**
 * Handles DicaReceita operations
 */
export default class DicaReceitaService {
  options: IServiceOptions;

  constructor(options) {
    this.options = options;
  }

  /**
   * Creates a DicaReceita.
   *
   * @param {*} data
   */
  async create(data) {
    const transaction = await SequelizeRepository.createTransaction(
      this.options.database,
    );

    try {
      const record = await DicaReceitaRepository.create(data, {
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
        'dicaReceita',
      );

      throw error;
    }
  }

  /**
   * Updates a DicaReceita.
   *
   * @param {*} id
   * @param {*} data
   */
  async update(id, data) {
    const transaction = await SequelizeRepository.createTransaction(
      this.options.database,
    );

    try {
      const record = await DicaReceitaRepository.update(
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
        'dicaReceita',
      );

      throw error;
    }
  }

  /**
   * Destroy all DicaReceitas with those ids.
   *
   * @param {*} ids
   */
  async destroyAll(ids) {
    const transaction = await SequelizeRepository.createTransaction(
      this.options.database,
    );

    try {
      for (const id of ids) {
        await DicaReceitaRepository.destroy(id, {
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
   * Finds the DicaReceita by Id.
   *
   * @param {*} id
   */
  async findById(id) {
    return DicaReceitaRepository.findById(id, this.options);
  }

  /**
   * Finds DicaReceitas for Autocomplete.
   *
   * @param {*} search
   * @param {*} limit
   */
  async findAllAutocomplete(search, limit) {
    return DicaReceitaRepository.findAllAutocomplete(
      search,
      limit,
      this.options,
    );
  }

  /**
   * Finds DicaReceitas based on the query.
   *
   * @param {*} args
   */
  async findAndCountAll(args) {
    return DicaReceitaRepository.findAndCountAll(
      args,
      this.options,
    );
  } 
  
  async findCalendario(args) {
    return DicaReceitaRepository.findCalendario(
      args,
      this.options,
    );
  }

  

  /**
   * Imports a list of DicaReceitas.
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
    const count = await DicaReceitaRepository.count(
      {
        importHash,
      },
      this.options,
    );

    return count > 0;
  }

  //Rotas App
  async appPilulaFindAndCountAll(args) {
    return DicaReceitaRepository.appPilulaFindAndCountAll(
      args,
      this.options,
    );
  }

  async appPilulaFindById(id) {
    return DicaReceitaRepository.appPilulaFindById(id, this.options);
  }
  
  async appProdutoFindAndCountAll(args) {
    return DicaReceitaRepository.appProdutoFindAndCountAll(
      args,
      this.options,
    );
  }

  async appProdutoFindById(id) {
    return DicaReceitaRepository.appProdutoFindById(id, this.options);
  }

  async appDicaFindAndCountAll(params) {
    return DicaReceitaRepository.appDicaFindAndCountAll(
      params,
      this.options,
    );
  }

  async appDicaFindById(id) {
    return DicaReceitaRepository.appDicaFindById(id, this.options);
  }

  async appReceitaFindAndCountAll(args) {
    return DicaReceitaRepository.appReceitaFindAndCountAll(
      args,
      this.options,
    );
  }

  async appReceitaFindById(id) {
    return DicaReceitaRepository.appReceitaFindById(id, this.options);
  }
}
