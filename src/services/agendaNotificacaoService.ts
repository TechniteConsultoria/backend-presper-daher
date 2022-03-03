import AgendaNotificacaoRepository from '../database/repositories/agendaNotificacaoRepository'
import Error400 from '../errors/Error400'
import SequelizeRepository from '../database/repositories/sequelizeRepository'
import { IServiceOptions } from './IServiceOptions'

/**
 * Handles AgendaNotificacao operations
 */
export default class AgendaNotificacaoService {
  options: IServiceOptions

  constructor (options) {
    this.options = options
  }

  /**
   * Creates a AgendaNotificacao.
   *
   * @param {*} data
   */
  async create (data) {
    const transaction = await SequelizeRepository.createTransaction(
      this.options.database,
    )

    try {
      const record = await AgendaNotificacaoRepository.create(
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
        'AgendaNotificacao',
      )

      throw error
    }
  }

  /**
   * Updates a AgendaNotificacao.
   *
   * @param {*} id
   * @param {*} data
   */

  
  async updateNotificacao (params, data) {
    const transaction = await SequelizeRepository.createTransaction(
      this.options.database,
    )

    try {
      const record = await AgendaNotificacaoRepository.updateNotificacao(
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
        'AgendaNotificacao',
      )

      throw error
    }
  }

  async update (params, data) {
    const transaction = await SequelizeRepository.createTransaction(
      this.options.database,
    )

    try {
      const record = await AgendaNotificacaoRepository.update(
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
        'AgendaNotificacao',
      )

      throw error
    }
  }

  /**
   * Destroy all AgendaNotificacaos with those ids.
   *
   * @param {*} ids
   */
  async destroyAll (ids) {
    const transaction = await SequelizeRepository.createTransaction(
      this.options.database,
    )

    try {
      for (const id of ids) {
        await AgendaNotificacaoRepository.destroy(id, {
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
   * Finds the AgendaNotificacao by Id.
   *
   * @param {*} id
   */
  async findById (params) {
    return AgendaNotificacaoRepository.findByToken(
      params,
      this.options,
    )
  }

  /**
   * Finds AgendaNotificacaos for Autocomplete.
   *
   * @param {*} search
   * @param {*} limit
   */
  async findAllAutocomplete (search, limit) {
    return AgendaNotificacaoRepository.findAllAutocomplete(
      search,
      limit,
      this.options,
    )
  }

  /**
   * Finds AgendaNotificacaos based on the query.
   *
   * @param {*} args
   */
  async findAndCountAll (args) {
    return AgendaNotificacaoRepository.findAndCountAll(
      args,
      this.options,
    )
  }

  /**
   * Finds AgendaNotificacaos based on the query.
   *
   * @param {*} args
   */
  async findNotificacoesAgenda () {
    return AgendaNotificacaoRepository.findNotificacoesAgenda(
      this.options,
    )
  }

  async findAll (args, res) {
    return AgendaNotificacaoRepository.findAll(
      args,
      res,
      this.options,
    )
  }

  /**
   * Imports a list of AgendaNotificacaos.
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
    const count = await AgendaNotificacaoRepository.count(
      {
        importHash,
      },
      this.options,
    )

    return count > 0
  }
}
