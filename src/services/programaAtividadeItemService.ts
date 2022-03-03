import ProgramaAtividadeItemRepository from '../database/repositories/programaAtividadeItemRepository';
import Error400 from '../errors/Error400';
import SequelizeRepository from '../database/repositories/sequelizeRepository';
import { IServiceOptions } from './IServiceOptions';

/**
 * Handles ProgramaAtividadeItem operations
 */
export default class ProgramaAtividadeItemService {
  options: IServiceOptions;

  constructor(options) {
    this.options = options;
  }

  /**
   * Creates a ProgramaAtividadeItem.
   *
   * @param {*} data
   */
  async create(data) {
    const transaction = await SequelizeRepository.createTransaction(
      this.options.database,
    );

    try {
      const record = await ProgramaAtividadeItemRepository.create(data, {
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
        'programaAtividadeItem',
      );

      throw error;
    }
  }

  /**
   * Updates a ProgramaAtividadeItem.
   *
   * @param {*} id
   * @param {*} data
   */
  async setClienteProgramaItem(data) {
    const transaction = await SequelizeRepository.createTransaction(
      this.options.database,
    );

    try {
      const record = await ProgramaAtividadeItemRepository.setClienteProgramaItem(
        data,
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
        'programaAtividadeItem',
      );

      throw error;
    }
  }
  
  async update(id, data) {
    const transaction = await SequelizeRepository.createTransaction(
      this.options.database,
    );

    try {
      const record = await ProgramaAtividadeItemRepository.update(
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
        'programaAtividadeItem',
      );

      throw error;
    }
  }

  /**
   * Destroy all ProgramaAtividadeItems with those ids.
   *
   * @param {*} ids
   */
  async destroyAll(ids) {
    const transaction = await SequelizeRepository.createTransaction(
      this.options.database,
    );

    try {
      for (const id of ids) {
        await ProgramaAtividadeItemRepository.destroy(id, {
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
   * Finds the ProgramaAtividadeItem by Id.
   *
   * @param {*} id
   */
  async findById(id) {
    return ProgramaAtividadeItemRepository.findById(id, this.options);
  }

  /**
   * Finds ProgramaAtividadeItems for Autocomplete.
   *
   * @param {*} search
   * @param {*} limit
   */
  async findAllAutocomplete(search, limit) {
    return ProgramaAtividadeItemRepository.findAllAutocomplete(
      search,
      limit,
      this.options,
    );
  }

  /**
   * Finds ProgramaAtividadeItems based on the query.
   *
   * @param {*} args
   */
  async findAndCountAll(args) {
    return ProgramaAtividadeItemRepository.findAndCountAll(
      args,
      this.options,
    );
  }

  async listAtividades(args) {
    return ProgramaAtividadeItemRepository.listAtividades(
      args,
      this.options,
    );
  }

  /**
   * Imports a list of ProgramaAtividadeItems.
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
    const count = await ProgramaAtividadeItemRepository.count(
      {
        importHash,
      },
      this.options,
    );

    return count > 0;
  }
}
