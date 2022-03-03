import { DataTypes } from 'sequelize';
import moment from 'moment';

/**
 * Avaliacao database model.
 * See https://sequelize.org/v5/manual/models-definition.html to learn how to customize it.
 */
export default function (sequelize) {
  const avaliacao = sequelize.define(
    'avaliacao',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      data: {
        type: DataTypes.DATE,
      },
      dataBioimpedancia: {
        type: DataTypes.DATEONLY,
        get: function() {
          // @ts-ignore
          return this.getDataValue('dataBioimpedancia')
            ? moment
                // @ts-ignore
                .utc(this.getDataValue('dataBioimpedancia'))
                .format('YYYY-MM-DD')
            : null;
        },
      },
      dataBioressonancia: {
        type: DataTypes.DATEONLY,
        get: function() {
          // @ts-ignore
          return this.getDataValue('dataBioressonancia')
            ? moment
                // @ts-ignore
                .utc(this.getDataValue('dataBioressonancia'))
                .format('YYYY-MM-DD')
            : null;
        },
      },
      peso: {
        type: DataTypes.DECIMAL(24, 2),
        validate: {

        }
      },
      altura: {
        type: DataTypes.DECIMAL(24, 2),
        validate: {

        }
      },
      imc: {
        type: DataTypes.DECIMAL(24, 2),
        validate: {

        }
      },

      diasTarefa: {
        type: DataTypes.INTEGER,
        validate: {

        }
      },

      tarefas: {
        type: DataTypes.TEXT,
        
      },
      
      diarioNutricional: {
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

  avaliacao.associate = (models) => {
    models.avaliacao.belongsTo(models.cliente, {
      as: 'cliente',
      constraints: false,
    });

    models.avaliacao.belongsToMany(models.questionario, {
      as: 'questionario',
      constraints: false,
      through: 'avaliacaoQuestionarioQuestionario',
    });

    models.avaliacao.hasMany(models.file, {
      as: 'dieta',
      foreignKey: 'belongsToId',
      constraints: false,
      scope: {
        belongsTo: models.avaliacao.getTableName(),
        belongsToColumn: 'dieta',
      },
    });

    models.avaliacao.hasMany(models.file, {
      as: 'bioimpedancia',
      foreignKey: 'belongsToId',
      constraints: false,
      scope: {
        belongsTo: models.avaliacao.getTableName(),
        belongsToColumn: 'bioimpedancia',
      },
    });

    models.avaliacao.hasMany(models.file, {
      as: 'bioressonancia',
      foreignKey: 'belongsToId',
      constraints: false,
      scope: {
        belongsTo: models.avaliacao.getTableName(),
        belongsToColumn: 'bioressonancia',
      },
    });

    models.avaliacao.hasMany(models.tarefa, {
      as: 'tarefa',
      constraints: false,
    })
    
    models.avaliacao.belongsTo(models.tenant, {
      as: 'tenant',
    });

    models.avaliacao.belongsTo(models.user, {
      as: 'createdBy',
    });

    models.avaliacao.belongsTo(models.user, {
      as: 'updatedBy',
    });
  };

  return avaliacao;
}
