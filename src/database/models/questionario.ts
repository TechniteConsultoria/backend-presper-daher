import { DataTypes } from 'sequelize';

/**
 * Questionario database model.
 * See https://sequelize.org/v5/manual/models-definition.html to learn how to customize it.
 */
export default function (sequelize) {
  const questionario = sequelize.define(
    'questionario',
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
        allowNull: true,
      },
      liberado: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      importHash: {
        type: DataTypes.STRING(255),
        allowNull: true,        
      },
      respondido:{
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      tipoGrafico: {
        type: DataTypes.TEXT,
        allowNull: true,
        validate: {
          notEmpty: true,
        }
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

  questionario.associate = (models) => {
    models.questionario.belongsTo(models.questionarioTipo, {
      as: 'tipo',
      constraints: false,
    });
    
    models.questionario.hasMany(models.file, {
      as: 'uploadPdf',
      foreignKey: 'belongsToId',
      constraints: false,
      scope: {
        belongsTo: models.questionario.getTableName(),
        belongsToColumn: 'uploadPdf',
      },
    });

    models.questionario.belongsTo(models.tenant, {
      as: 'tenant',
    });

    models.questionario.belongsTo(models.user, {
      as: 'createdBy',
    });

    models.questionario.belongsTo(models.user, {
      as: 'updatedBy',
    });
  };

  return questionario;
}
