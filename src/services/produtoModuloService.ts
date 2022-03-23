import Error400 from '../errors/Error400';
import SequelizeRepository from '../database/repositories/sequelizeRepository';
import { IServiceOptions } from './IServiceOptions';
import ProdutoModuloRepository from '../database/repositories/produtoModuloRepository';
import EmpresaRepository from '../database/repositories/empresaRepository';
import CategoriaRepository from '../database/repositories/categoriaRepository';
import upload from '../api/file/localhost/upload';

export default class ProdutoModuloService {
  options: IServiceOptions;

  constructor(options) {
    this.options = options;
  }

  async create(data) {
    const transaction = await SequelizeRepository.createTransaction(
      this.options.database,
    );

    try {
      /*

      Quando for dar o get no produto deve-se ser passada o id da empresa
      onde ele é passado?
      localStorage?
      
      */

      const userData = SequelizeRepository.getCurrentUser(
        this.options,
      );

      const record = await ProdutoModuloRepository.create(data, {
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
        'produto',
      );

      throw error;
    }
  }
  async produtoUpdateStatus(id, data) {
    await ProdutoModuloRepository.produtoUpdateStatus(id, data);
  }
  async update(id, data) {
    const transaction = await SequelizeRepository.createTransaction(
      this.options.database,
    );

    try {
      const record = await ProdutoModuloRepository.update(
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
        'produto',
      );

      throw error;
    }
  }

  async destroyAll(ids) {
    const transaction = await SequelizeRepository.createTransaction(
      this.options.database,
    );

    try {
      for (const id of ids) {
        await ProdutoModuloRepository.destroy(id, {
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


  async destroyOne(id) {
    console.log("id")
    console.log(id)

    const transaction = await SequelizeRepository.createTransaction(
      this.options.database,
    );

    try {
      await ProdutoModuloRepository.destroy(id, {
        ...this.options,
        transaction,
      });

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

  async findById(id) {
    return ProdutoModuloRepository.findById(id, this.options);
  }

  async findAllAutocomplete(search, limit) {
    return ProdutoModuloRepository.findAllAutocomplete(
      search,
      limit,
      this.options,
    );
  }

  async findAndCountAll(args) {
    return ProdutoModuloRepository.findAndCountAll(
      args,
      this.options,
    );
  }

  async findAllWithoutLogin() {
    return ProdutoModuloRepository.findAllWithoutLogin();
  }
  async findAllWithoutLoginTrue() {
    return ProdutoModuloRepository.findAllWithoutLoginTrue();
  }

  async findAllWithoutLoginAndTenant(args) {
    return ProdutoModuloRepository.findAllWithoutLoginAndTenant(args);
  }
  
  async findLimitedWithoutLogin() {
    return ProdutoModuloRepository.findLimitedWithoutLogin();
  }
  async findProdutobyId(id) {
    return ProdutoModuloRepository.findProdutobyId(id);
  }
  async listPromocionalImagem() {
    return ProdutoModuloRepository.listPromocionalImagem();
  }

  async deleteProdutobyId(id) {
    return ProdutoModuloRepository.deletePromocionalImagem(id);
  }

  async produtoAfterBuy(id, quantidade) {
    return ProdutoModuloRepository.produtoAfterBuy(id, quantidade);
  }

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

  async _isImportHashExistent(importHash) {
    const count = await ProdutoModuloRepository.count(
      {
        importHash,
      },
      this.options,
    );

    return count > 0;
  }
  async updateAllDatabaseOfPagementos(){
    return ProdutoModuloRepository.updateAllDatabaseOfPagementos();
  }
  async updateAllIsOferta(){
    return ProdutoModuloRepository.updateAllIsOferta();
  }

}
