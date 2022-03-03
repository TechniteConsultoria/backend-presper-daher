import AgendaRepository from '../database/repositories/agendaRepository'
import Error400 from '../errors/Error400'
import SequelizeRepository from '../database/repositories/sequelizeRepository'
import { IServiceOptions } from './IServiceOptions'
import Sequelize from 'sequelize'
import Error403 from '../errors/Error403'

const Op = Sequelize.Op

/**
 * Handles Agenda operations
 */
export default class AgendaService {
  options: IServiceOptions

  constructor (options) {
    this.options = options
  }

  /**
   * Creates a Agenda.
   *
   * @param {*} data
   */
  async create (data) {
    const transaction = await SequelizeRepository.createTransaction(
      this.options.database,
    )

    try {
      const record = await AgendaRepository.create(data, {
        ...this.options,
        transaction,
      })

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
        'agenda',
      )

      throw error
    }
  }

  /**
   * Updates a Agenda.
   *
   * @param {*} id
   * @param {*} data
   */
  async update (id, data) {
    const transaction = await SequelizeRepository.createTransaction(
      this.options.database,
    )

    try {
      const record = await AgendaRepository.update(
        id,
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
        'agenda',
      )

      throw error
    }
  }

  async updateAtendimento (id, data) {
    const transaction = await SequelizeRepository.createTransaction(
      this.options.database,
    )

    try {
      let dataAtual = new Date()

      let agendamentos = await this.options.database.agenda.findAll(
        {
          where: {
            clienteId: data.cliente,
            nutricionistaId: data.nutricionista,
            dataAgendada: { [Op.gte]: dataAtual },
            statusConsulta: {
              [Op.in]: [
                'Aguardando_Confirmação',
                'Confirmada',
              ],
            },
          },
          transaction,
        },
      )    

      if (agendamentos.length > 0) {
        throw new Error403('pt-BR', 3)
      }

      const record = await AgendaRepository.updateAtendimento(
        id,
        data,
        {
          ...this.options,
          transaction,
        },
      )

      await SequelizeRepository.commitTransaction(
        transaction,
      )

      return
    } catch (error) {
      await SequelizeRepository.rollbackTransaction(
        transaction,
      )

      SequelizeRepository.handleUniqueFieldError(
        error,
        this.options.language,
        'agenda',
      )

      throw error
    }
  }

  /**
   * Destroy all Agendas with those ids.
   *
   * @param {*} ids
   */
  async destroyAll (ids) {
    const transaction = await SequelizeRepository.createTransaction(
      this.options.database,
    )

    try {
      for (const id of ids) {
        await AgendaRepository.destroy(id, {
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
   * Finds the Agenda by Id.
   *
   * @param {*} id
   */
  async findById (id) {
    return AgendaRepository.findById(id, this.options)
  }

  async validarConsulta (params) {
    return AgendaRepository.validarConsulta(params)
  }

  /**
   * Finds Agendas for Autocomplete.
   *
   * @param {*} search
   * @param {*} limit
   */
  async findAllAutocomplete (search, limit) {
    return AgendaRepository.findAllAutocomplete(
      search,
      limit,
      this.options,
    )
  }

  /**
   * Finds Agendas based on the query.
   *
   * @param {*} args
   */
  async findAndCountAll (args) {
    return AgendaRepository.findAndCountAll(
      args,
      this.options,
    )
  }

  async findAgendamentosDisponiveis (args) {
    return AgendaRepository.findAgendamentosDisponiveis(
      args,
      this.options,
    )
  }

  async findAgendamentosMarcados (args) {
    return AgendaRepository.findAgendamentosMarcados(
      args,
      this.options,
    )
  }

  async findAll (res) {
    return AgendaRepository.findAll(res, this.options)
  }

  /**
   * Imports a list of Agendas.
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
    const count = await AgendaRepository.count(
      {
        importHash,
      },
      this.options,
    )

    return count > 0
  }
}
