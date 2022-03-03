import { DataTypes } from 'sequelize';

/**
 * PilulaSouLeve database model.
 * See https://sequelize.org/v5/manual/models-definition.html to learn how to customize it.
 */
export default function (sequelize) {
  const pilulaSouLeve = sequelize.define(
    'pilulaSouLeve',
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
      dia: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {

        }
      },
      frase: {
        type: DataTypes.TEXT,
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

  pilulaSouLeve.associate = (models) => {
    models.pilulaSouLeve.belongsTo(models.programa, {
      as: 'programa',
      constraints: false,
    });



    models.pilulaSouLeve.hasMany(models.file, {
      as: 'audio',
      foreignKey: 'belongsToId',
      constraints: false,
      scope: {
        belongsTo: models.pilulaSouLeve.getTableName(),
        belongsToColumn: 'audio',
      },
    });
    
    models.pilulaSouLeve.belongsTo(models.tenant, {
      as: 'tenant',
    });

    models.pilulaSouLeve.belongsTo(models.user, {
      as: 'createdBy',
    });

    models.pilulaSouLeve.belongsTo(models.user, {
      as: 'updatedBy',
    });
  };

  return pilulaSouLeve;
}
