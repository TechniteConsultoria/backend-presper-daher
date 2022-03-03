import { DataTypes } from 'sequelize';

/**
 * Plano database model.
 * See https://sequelize.org/v5/manual/models-definition.html to learn how to customize it.
 */
export default function (sequelize) {
  const plano = sequelize.define(
    'plano',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      nome: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: true,
        }
      },
      valor: {
        type: DataTypes.DECIMAL(24, 2),
        validate: {

        }
      },
      duracao: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {

        }
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

  plano.associate = (models) => {


    models.plano.hasMany(models.file, {
      as: 'imagem',
      foreignKey: 'belongsToId',
      constraints: false,
      scope: {
        belongsTo: models.plano.getTableName(),
        belongsToColumn: 'imagem',
      },
    });
    
    models.plano.belongsTo(models.tenant, {
      as: 'tenant',
    });

    models.plano.belongsTo(models.user, {
      as: 'createdBy',
    });

    models.plano.belongsTo(models.user, {
      as: 'updatedBy',
    });
  };

  return plano;
}
