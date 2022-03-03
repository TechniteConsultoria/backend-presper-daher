import { DataTypes } from 'sequelize';

/**
 * CursoModulo database model.
 * See https://sequelize.org/v5/manual/models-definition.html to learn how to customize it.
 */
export default function (sequelize) {
  const cursoModulo = sequelize.define(
    'cursoModulo',
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

  cursoModulo.associate = (models) => {
    models.cursoModulo.belongsTo(models.curso, {
      as: 'curso',
      constraints: false,
    });

    models.cursoModulo.hasMany(models.file, {
      as: 'imagem',
      foreignKey: 'belongsToId',
      constraints: false,
      scope: {
        belongsTo: models.cursoModulo.getTableName(),
        belongsToColumn: 'imagem',
      },
    });
    
    models.cursoModulo.belongsTo(models.tenant, {
      as: 'tenant',
    });

    models.cursoModulo.belongsTo(models.user, {
      as: 'createdBy',
    });

    models.cursoModulo.belongsTo(models.user, {
      as: 'updatedBy',
    });
  };

  return cursoModulo;
}
