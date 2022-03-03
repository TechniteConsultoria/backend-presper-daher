import { DataTypes } from 'sequelize';

/**
 * CursoAula database model.
 * See https://sequelize.org/v5/manual/models-definition.html to learn how to customize it.
 */
export default function (sequelize) {
  const cursoAula = sequelize.define(
    'cursoAula',
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
      url: {
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

  cursoAula.associate = (models) => {
    models.cursoAula.belongsTo(models.cursoModulo, {
      as: 'modulo',
      constraints: false,
    });

    models.cursoAula.hasMany(models.file, {
      as: 'imagem',
      foreignKey: 'belongsToId',
      constraints: false,
      scope: {
        belongsTo: models.cursoAula.getTableName(),
        belongsToColumn: 'imagem',
      },
    });

    models.cursoAula.hasMany(models.file, {
      as: 'apostila',
      foreignKey: 'belongsToId',
      constraints: false,
      scope: {
        belongsTo: models.cursoAula.getTableName(),
        belongsToColumn: 'apostila',
      },
    });

    models.cursoAula.hasMany(models.file, {
      as: 'questionario',
      foreignKey: 'belongsToId',
      constraints: false,
      scope: {
        belongsTo: models.cursoAula.getTableName(),
        belongsToColumn: 'questionario',
      },
    });
    
    models.cursoAula.belongsTo(models.tenant, {
      as: 'tenant',
    });

    models.cursoAula.belongsTo(models.user, {
      as: 'createdBy',
    });

    models.cursoAula.belongsTo(models.user, {
      as: 'updatedBy',
    });
  };

  return cursoAula;
}
