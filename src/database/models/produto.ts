import { DataTypes } from 'sequelize';
import { BLOB } from 'sequelize/types';

export default function (sequelize) {
  const produto = sequelize.define(
    'produto',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      nome: {
        type: DataTypes.TEXT,
      },
      titulo: {
        type: DataTypes.TEXT,
      },
      autor: {
        type: DataTypes.TEXT,
      },
      descricao: {
        type: DataTypes.TEXT,
      },
      marca: {
        type: DataTypes.TEXT,
      },
      prazo: {
        type: DataTypes.TEXT,
      },
      frete: {
        type: DataTypes.TEXT,
      },
      modelo: {
        type: DataTypes.TEXT,
      },
      caracteristicas: {
        type: DataTypes.TEXT,
      },
      status: {
        type: DataTypes.TEXT
      },
      imagemUrl: {
        type: DataTypes.TEXT
      },
      codigo: {
        type: DataTypes.TEXT,
      },
      caracteristicasTecnicas: {
        type: DataTypes.TEXT,
      },
      preco: {
        type: DataTypes.DECIMAL(10, 2),
      },
      somatoriaAvaliacoes: {
        type: DataTypes.INTEGER,
      },
      quantidadeAvaliacoes: {
        type: DataTypes.INTEGER,
      },
      volumeVendas: {
        type: DataTypes.INTEGER,
      },
      quantidadeNoEstoque : {
        type: DataTypes.INTEGER,
      },
      imagemPromocional: {
        type: DataTypes.TEXT
      },
      isOferta: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      promocaoEncerramento: {
        type: DataTypes.DATE,

      },
      promocaoCriacao: {
        type: DataTypes.DATE,
      },
      promocaoId: {
        type: DataTypes.TEXT,
      },
      precoOferta: {
        type: DataTypes.DECIMAL(10, 2),
      },
      certificado: {
        type: DataTypes.BLOB
      },
      importHash: {
        type: DataTypes.STRING(255),
        allowNull: true,
        validate: {
          len: [0, 255],
        },
      },
    },
    {
      indexes: [
        {
          unique: true,
          fields: ['importHash', 'tenantId'],
          where: {
            deletedAt: null,
          },
        },

      ],
      timestamps: true,
      paranoid: true,
    },
  );

  produto.associate = (models) => {

    models.produto.hasMany(models.produtoModulo, {
      as: 'produtoModulo',
      constraints: false,
    });

    models.produto.belongsTo(models.user, {
      as: 'user',
      constraints: false,
    });

    models.produto.belongsTo(models.categoria, {
      as: 'categoria',
      constraints: false,
    });

    models.produto.hasMany(models.file, {
      as: 'fotos',
      foreignKey: 'belongsToId',
      constraints: false,
      scope: {
        belongsTo: models.produto.getTableName(),
        belongsToColumn: 'fotos',
      },
    });

    models.produto.belongsTo(models.tenant, {
      as: 'tenant',
      foreignKey: {
        allowNull: false,
      },
    });

    models.produto.belongsTo(models.user, {
      as: 'createdBy',
    });

    models.produto.belongsTo(models.user, {
      as: 'updatedBy',
    });
  };

  return produto;
}
