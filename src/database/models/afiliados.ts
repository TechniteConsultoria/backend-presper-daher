import { DataTypes } from 'sequelize';

/**
 * Afiliados database model.
 * See https://sequelize.org/v5/manual/models-definition.html to learn how to customize it.
 */
export default function (sequelize) {
  const afiliados = sequelize.define(
    'afiliados',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      tipoPessoa: {
        type: DataTypes.ENUM,
        allowNull: false,
        values: [
          "CPF",
          "CNPJ"
        ],
      },
      documento: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
          notEmpty: true,
        }
      },
      nome: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: true,
        }
      },
      nomeFantasia: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: true,
        }
      },
      cep: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: true,
        }
      },
      uf: {
        type: DataTypes.STRING(2),
        allowNull: false,
        validate: {
          notEmpty: true,
        }
      },
      cidade: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: true,
        }
      },
      bairro: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: true,
        }
      },
      logradouro: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: true,
        }
      },
      numero: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: true,
        }
      },
      complemento: {
        type: DataTypes.TEXT,
      },
      ativo: {
        type: DataTypes.ENUM,
        values: [
          "Sim",
          "Não"
        ],
      },
      importHash: {
        type: DataTypes.STRING(255),
        allowNull: true,        
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

  afiliados.associate = (models) => {


    models.afiliados.hasMany(models.file, {
      as: 'foto',
      foreignKey: 'belongsToId',
      constraints: false,
      scope: {
        belongsTo: models.afiliados.getTableName(),
        belongsToColumn: 'foto',
      },
    });
    
    models.afiliados.belongsTo(models.tenant, {
      as: 'tenant',
    });

    models.afiliados.belongsTo(models.user, {
      as: 'createdBy',
    });

    models.afiliados.belongsTo(models.user, {
      as: 'updatedBy',
    });
  };

  return afiliados;
}
