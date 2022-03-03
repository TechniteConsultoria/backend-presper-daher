import { DataTypes } from 'sequelize';

/**
 * Curso database model.
 * See https://sequelize.org/v5/manual/models-definition.html to learn how to customize it.
 */
export default function (sequelize) {
  const curso = sequelize.define(
    'curso',
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
      liberado: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      preco: {
        type: DataTypes.DECIMAL(24, 2),
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

  curso.associate = (models) => {


    models.curso.hasMany(models.file, {
      as: 'imagem',
      foreignKey: 'belongsToId',
      constraints: false,
      scope: {
        belongsTo: models.curso.getTableName(),
        belongsToColumn: 'imagem',
      },
    });

    models.curso.hasMany(models.cursoCliente, {
      as: 'cursoCliente',
      constraints: false,
    });
    
    models.curso.belongsTo(models.tenant, {
      as: 'tenant',
    });

    models.curso.belongsTo(models.user, {
      as: 'createdBy',
    });

    models.curso.belongsTo(models.user, {
      as: 'updatedBy',
    });
  };

  return curso;
}
