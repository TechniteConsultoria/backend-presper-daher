import { DataTypes } from 'sequelize';

/**
 * Programa database model.
 * See https://sequelize.org/v5/manual/models-definition.html to learn how to customize it.
 */
export default function (sequelize) {
  const programa = sequelize.define(
    'programa',
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
      descricao: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: true,
        }
      },
      dias: {
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

  programa.associate = (models) => {


    models.programa.hasMany(models.file, {
      as: 'imagem',
      foreignKey: 'belongsToId',
      constraints: false,
      scope: {
        belongsTo: models.programa.getTableName(),
        belongsToColumn: 'imagem',
      },
    });
    
    models.programa.belongsTo(models.tenant, {
      as: 'tenant',
    });

    models.programa.belongsTo(models.user, {
      as: 'createdBy',
    });

    models.programa.belongsTo(models.user, {
      as: 'updatedBy',
    });
  };

  return programa;
}
