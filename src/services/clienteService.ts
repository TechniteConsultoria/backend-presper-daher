import ClienteRepository from '../database/repositories/clienteRepository';
import Error400 from '../errors/Error400';
import SequelizeRepository from '../database/repositories/sequelizeRepository';
import { IServiceOptions } from './IServiceOptions';
import { Md5 } from 'ts-md5/dist/md5';
import { v4 as uuidv4 } from 'uuid';
import cliente from '../database/models/cliente';
import { any } from 'sequelize/types/lib/operators';
import { toJson } from 'cli-highlight';
import Error403 from '../errors/Error403';

/**
 * Handles Cliente operations
 */
export default class ClienteService {
  options: IServiceOptions;

  constructor(options) {
    this.options = options;
  }

  /**
   * Creates a Cliente.
   *
   * @param {*} data
   */
  async create(data) {
    const transaction = await SequelizeRepository.createTransaction(
      this.options.database,
    );

    try {
      const record = await ClienteRepository.create(data, {
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
        'cliente',
      );

      throw error;
    }
  }

  /**
   * Updates a Cliente.
   *
   * @param {*} id
   * @param {*} data
   */
  async update(id, data) {
    const transaction = await SequelizeRepository.createTransaction(
      this.options.database,
    );

    try {
      const record = await ClienteRepository.update(
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
        'cliente',
      );

      throw error;
    }
  }

  /**
   * Destroy all Clientes with those ids.
   *
   * @param {*} ids
   */
  async destroyAll(ids) {
    const transaction = await SequelizeRepository.createTransaction(
      this.options.database,
    );

    try {
      for (const id of ids) {
        await ClienteRepository.destroy(id, {
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
   * Finds the Cliente by Id.
   *
   * @param {*} id
   */
  async findById(id) {
    return ClienteRepository.findById(id, this.options);
  }

  /**
   * Finds Clientes for Autocomplete.
   *
   * @param {*} search
   * @param {*} limit
   */
  async findAllAutocomplete(search, limit) {
    return ClienteRepository.findAllAutocomplete(
      search,
      limit,
      this.options,
    );
  }

  /**
   * Finds Clientes based on the query.
   *
   * @param {*} args
   */
  async findAndCountAll(args) {
    return ClienteRepository.findAndCountAll(
      args,
      this.options,
    );
  }

  /**
   * Imports a list of Clientes.
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
    const count = await ClienteRepository.count(
      {
        importHash,
      },
      this.options,
    );

    return count > 0;
  }

  async createExterno(data) {
    const transaction = await SequelizeRepository.createTransaction(
      this.options.database,
    );

    try {

      const record = await ClienteRepository.appCreate(data, {
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
        'cliente',
      );

      throw error;
    }
  }

  async loginExterno(email, senha) {

    let transaction = await SequelizeRepository.createTransaction(
      this.options.database,
    );

    try {

      let validar = ClienteRepository.validateLogin(email, senha, { ...this.options, transaction });

      const token = Md5.hashStr(uuidv4());

      let data;

      validar.then(async (v) => {
        data = Object.entries(v);
        data = data[0][1];
        data['token'] = token;
        let id = data['id'];

        const record = ClienteRepository.generateToken(
          data.id,
          data,
          {
            ...this.options,
            transaction,
          },
        );

        await SequelizeRepository.commitTransaction(
          transaction,
        );
      });

      let cliente = await ClienteRepository.validateLogin(email, senha, { ...this.options, transaction });

      let clienteEntries;
      let clienteId;
      let clienteToken;

      clienteEntries = Object.entries(cliente);
      clienteId = clienteEntries[0][1].id;
      clienteToken = data.token;

      var string = JSON.stringify({
        id: clienteId,
        token: clienteToken
      })

      var json = JSON.parse(string);

      return json;

    }
    catch (error) {

      await SequelizeRepository.rollbackTransaction(
        transaction,
      );

      SequelizeRepository.handleUniqueFieldError(
        error,
        this.options.language,
        'cliente',
      );

      throw error;
    }
  }

  async appPerfil(id) {
    const transaction = await SequelizeRepository.createTransaction(
      this.options.database,
    );

    try {

      const record = await ClienteRepository.appFindById(id, {
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
        'cliente',
      );

      throw error;
    }
  }

  async appUpdate(id, data) {
    const transaction = await SequelizeRepository.createTransaction(
      this.options.database,
    );

    try {
      const record = await ClienteRepository.appUpdate(
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
        'cliente',
      );

      throw error;
    }
  }

  async verificarEmail(id, token) {

    try {
      const record = await this.checkIdToken(
        id,
        token,
        {
          ...this.options
        },
      );

      if (record == 1){
        await ClienteRepository.verificarCliente(id, token, this.options);
      }

      else{
        throw new Error403;
      }

    } catch (error) {

      SequelizeRepository.handleUniqueFieldError(
        error,
        this.options.language,
        'cliente',
      );

      throw error;
    }
  }

  async checkIdToken(id, token, options?) {
    options = options || {};

    return ClienteRepository.checkIdToken(id, token, {
      ...this.options,
      ...options,
    });
  }

  async checkIdTokenHash(id, token, hash, options?) {
    options = options || {};

    return ClienteRepository.checkIdTokenHash(id, token, hash, {
      ...this.options,
      ...options,
    });
  }

}
