import { DataTypes } from 'sequelize';

/**
 * QuestionarioTipo database model.
 * See https://sequelize.org/v5/manual/models-definition.html to learn how to customize it.
 */
export default function (sequelize) {
  const questionarioTipo = sequelize.define(
    'questionarioTipo',
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
      pergunta: {
        type: DataTypes.ENUM,
        allowNull: false,
        values: [
          "Sim",
          "Não"
        ],
      },
      disc: {
        type: DataTypes.ENUM,
        allowNull: false,
        values: [
          "Sim",
          "Não"
        ],
      },
      escala: {
        type: DataTypes.ENUM,
        allowNull: false,
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

  questionarioTipo.associate = (models) => {



    
    models.questionarioTipo.belongsTo(models.tenant, {
      as: 'tenant',
    });

    models.questionarioTipo.belongsTo(models.user, {
      as: 'createdBy',
    });

    models.questionarioTipo.belongsTo(models.user, {
      as: 'updatedBy',
    });
  };

  return questionarioTipo;
}
