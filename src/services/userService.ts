import UserRepository from '../database/repositories/userRepository';
import Error400 from '../errors/Error400';
import SequelizeRepository from '../database/repositories/sequelizeRepository';
import { IServiceOptions } from './IServiceOptions';

/**
 * Handles User operations
 */
export default class UserService {
  options: IServiceOptions;

  constructor(options) {
    this.options = options;
  }

  /**
   * Creates a User.
   *
   * @param {*} data
   */
  async create(data) {
    const transaction = await SequelizeRepository.createTransaction(
      this.options.database,
    );

    try {
      const record = await UserRepository.create(data, {
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
        'user',
      );

      throw error;
    }
  }

  /**
   * Updates a User.
   *
   * @param {*} id
   * @param {*} data
   */
  async update(id, data) {
    const transaction = await SequelizeRepository.createTransaction(
      this.options.database,
    );

    try {
      const record = await UserRepository.update(
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
        'user',
      );

      throw error;
    }
  }

  /**
   * Destroy all Users with those ids.
   *
   * @param {*} ids
   */
//   async destroyAll(ids) {
//     const transaction = await SequelizeRepository.createTransaction(
//       this.options.database,
//     );

//     try {
//       for (const id of ids) {
//         await UserRepository.destroy(id, {
//           ...this.options,
//           transaction,
//         });
//       }

//       await SequelizeRepository.commitTransaction(
//         transaction,
//       );
//     } catch (error) {
//       await SequelizeRepository.rollbackTransaction(
//         transaction,
//       );
//       throw error;
//     }
//   }

  /**
   * Finds the User by Id.
   *
   * @param {*} id
   */
  async findById(id) {
    return UserRepository.findById(id, this.options);
  }

  async findByBairro(bairro) {
    return UserRepository.getByBairro(bairro);
  }

  async findByCidade(cidade) {
    return UserRepository.getByCidade(cidade);
  }

  async findByEstado(estado) {
    return UserRepository.getByEstado(estado);
  }

  async findByPais() {
    return UserRepository.getByPais();
  }
  /**
   * Finds Users for Autocomplete.
   *
   * @param {*} search
   * @param {*} limit
   */
  async findAllAutocomplete(search, limit) {
    return UserRepository.findAllAutocomplete(
      search,
      limit,
      this.options,
    );
  }

  /**
   * Finds Users based on the query.
   *
   * @param {*} args
   */
  async findAndCountAll(args) {
    return UserRepository.findAndCountAll(
      args,
      this.options,
    );
  }

  /**
   * Imports a list of Users.
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
    const count = await UserRepository.count(
      {
        importHash,
      },
      this.options,
    );

    return count > 0;
  }

/*   async appFindAndCountAll(args) {
    return UserRepository.appFindAndCountAll(
      args,
      this.options,
    );
  }

  async appFindById(id) {
    return UserRepository.appFindById(id, this.options);
  } */

}
