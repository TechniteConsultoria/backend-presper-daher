import NotificacaoClienteRepository from '../database/repositories/notificacaoClienteRepository'
import Error400 from '../errors/Error400'
import SequelizeRepository from '../database/repositories/sequelizeRepository'
import { IServiceOptions } from './IServiceOptions'

/**
 * Handles NotificacaoCliente operations
 */
export default class NotificacaoClienteService {
  options: IServiceOptions

  constructor (options) {
    this.options = options
  }

  /**
   * Creates a NotificacaoCliente.
   *
   * @param {*} data
   */
  async create (data) {
    const transaction = await SequelizeRepository.createTransaction(
      this.options.database,
    )

    try {
      const record = await NotificacaoClienteRepository.create(
        data,
        {
          ...this.options,
          transaction,
        },
      )

      await SequelizeRepository.commitTransaction(
        transaction,
      )

      return record
    } catch (error) {
      await SequelizeRepository.rollbackTransaction(
        transaction,
      )

      SequelizeRepository.handleUniqueFieldError(
        error,
        this.options.language,
        'NotificacaoCliente',
      )

      throw error
    }
  }

  /**
   * Updates a NotificacaoCliente.
   *
   * @param {*} id
   * @param {*} data
   */

  
  async updateNotificacao (params, data) {
    const transaction = await SequelizeRepository.createTransaction(
      this.options.database,
    )

    try {
      const record = await NotificacaoClienteRepository.updateNotificacao(
        params,
        data,
        {
          ...this.options,
          transaction,
        },
      )

      await SequelizeRepository.commitTransaction(
        transaction,
      )

      return record
    } catch (error) {
      await SequelizeRepository.rollbackTransaction(
        transaction,
      )

      SequelizeRepository.handleUniqueFieldError(
        error,
        this.options.language,
        'NotificacaoCliente',
      )

      throw error
    }
  }

  async update (params, data) {
    const transaction = await SequelizeRepository.createTransaction(
      this.options.database,
    )

    try {
      const record = await NotificacaoClienteRepository.update(
        params.id,
        data,
        {
          ...this.options,
          transaction,
        },
      )

      await SequelizeRepository.commitTransaction(
        transaction,
      )

      return record
    } catch (error) {
      await SequelizeRepository.rollbackTransaction(
        transaction,
      )

      SequelizeRepository.handleUniqueFieldError(
        error,
        this.options.language,
        'NotificacaoCliente',
      )

      throw error
    }
  }

  /**
   * Destroy all NotificacaoClientes with those ids.
   *
   * @param {*} ids
   */
  async destroyAll (ids) {
    const transaction = await SequelizeRepository.createTransaction(
      this.options.database,
    )

    try {
      for (const id of ids) {
        await NotificacaoClienteRepository.destroy(id, {
          ...this.options,
          transaction,
        })
      }

      await SequelizeRepository.commitTransaction(
        transaction,
      )
    } catch (error) {
      await SequelizeRepository.rollbackTransaction(
        transaction,
      )
      throw error
    }
  }

  /**
   * Finds the NotificacaoCliente by Id.
   *
   * @param {*} id
   */
  async findById (params) {
    return NotificacaoClienteRepository.findByToken(
      params,
      this.options,
    )
  }

  /**
   * Finds NotificacaoClientes for Autocomplete.
   *
   * @param {*} search
   * @param {*} limit
   */
  async findAllAutocomplete (search, limit) {
    return NotificacaoClienteRepository.findAllAutocomplete(
      search,
      limit,
      this.options,
    )
  }

  /**
   * Finds NotificacaoClientes based on the query.
   *
   * @param {*} args
   */
  async findAndCountAll (args) {
    return NotificacaoClienteRepository.findAndCountAll(
      args,
      this.options,
    )
  }

  async findAll (args, res) {
    return NotificacaoClienteRepository.findAll(
      args,
      res,
      this.options,
    )
  }

  /**
   * Imports a list of NotificacaoClientes.
   *
   * @param {*} data
   * @param {*} importHash
   */
  async import (data, importHash) {
    if (!importHash) {
      throw new Error400(
        this.options.language,
        'importer.errors.importHashRequired',
      )
    }

    if (await this._isImportHashExistent(importHash)) {
      throw new Error400(
        this.options.language,
        'importer.errors.importHashExistent',
      )
    }

    const dataToCreate = {
      ...data,
      importHash,
    }

    return this.create(dataToCreate)
  }

  /**
   * Checks if the import hash already exists.
   * Every item imported has a unique hash.
   *
   * @param {*} importHash
   */
  async _isImportHashExistent (importHash) {
    const count = await NotificacaoClienteRepository.count(
      {
        importHash,
      },
      this.options,
    )

    return count > 0
  }
}
