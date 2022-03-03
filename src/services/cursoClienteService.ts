import CursoClienteRepository from '../database/repositories/cursoClienteRepository';
import Error400 from '../errors/Error400';
import SequelizeRepository from '../database/repositories/sequelizeRepository';
import { IServiceOptions } from './IServiceOptions';

/**
 * Handles CursoCliente operations
 */
export default class CursoClienteService {
  options: IServiceOptions;

  constructor(options) {
    this.options = options;
  }

  /**
   * Creates a CursoCliente.
   *
   * @param {*} data
   */
  async create(data) {
    const transaction = await SequelizeRepository.createTransaction(
      this.options.database,
    );

    try {
      const record = await CursoClienteRepository.create(data, {
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
        'cursoCliente',
      );

      throw error;
    }
  }

  /**
   * Updates a CursoCliente.
   *
   * @param {*} id
   * @param {*} data
   */
  async update(id, data) {
    const transaction = await SequelizeRepository.createTransaction(
      this.options.database,
    );

    try {
      const record = await CursoClienteRepository.update(
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
        'cursoCliente',
      );

      throw error;
    }
  }

  /**
   * Destroy all CursoClientes with those ids.
   *
   * @param {*} ids
   */
  async destroyAll(ids) {
    const transaction = await SequelizeRepository.createTransaction(
      this.options.database,
    );

    try {
      for (const id of ids) {
        await CursoClienteRepository.destroy(id, {
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
   * Finds the CursoCliente by Id.
   *
   * @param {*} id
   */
  async findById(id) {
    return CursoClienteRepository.findById(id, this.options);
  }

  /**
   * Finds CursoClientes for Autocomplete.
   *
   * @param {*} search
   * @param {*} limit
   */
  async findAllAutocomplete(search, limit) {
    return CursoClienteRepository.findAllAutocomplete(
      search,
      limit,
      this.options,
    );
  }

  /**
   * Finds CursoClientes based on the query.
   *
   * @param {*} args
   */
  async findAndCountAll(args) {
    return CursoClienteRepository.findAndCountAll(
      args,
      this.options,
    );
  }

  async rotinaBoleto(){
    const transaction = await SequelizeRepository.createTransaction(
      this.options.database,
    ); 
    try {
      const record = await CursoClienteRepository.rotinaBoleto({
        ...this.options,
        transaction,
      });

      await SequelizeRepository.commitTransaction(
        transaction,
      );

      return record;
    } catch(error){
      await SequelizeRepository.rollbackTransaction(
        transaction,
      );

      SequelizeRepository.handleUniqueFieldError(
        error,
        this.options.language,
        'cursoCliente',
      );
      throw error;
    }  
  }

  /**
   * Imports a list of CursoClientes.
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
    const count = await CursoClienteRepository.count(
      {
        importHash,
      },
      this.options,
    );

    return count > 0;
  }

  async appFindAndCountAll(id, args) {
    return CursoClienteRepository.appFindAndCountAll(id,
      args,
      this.options,
    );
  }

  async appCreate(data) {
    const transaction = await SequelizeRepository.createTransaction(
      this.options.database,
    );

    try {
      const record = await CursoClienteRepository.appCreate(data, {
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
        'cursoCliente',
      );
      throw error;
    }
  }

  async appFindById(id) {
    return CursoClienteRepository.appFindById(id, this.options);
  }

  async appUltimoAdquirido(id, args) {
    return CursoClienteRepository.appUltimoAdquirido(id,
      args,
      this.options,
    );
  }
}
