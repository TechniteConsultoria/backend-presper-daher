import { DataTypes } from 'sequelize';

/**
 * QuestionarioPergunta database model.
 * See https://sequelize.org/v5/manual/models-definition.html to learn how to customize it.
 */
export default function (sequelize) {
  const questionarioPergunta = sequelize.define(
    'questionarioPergunta',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      pergunta: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: true,
        }
      },
      tipoResposta: {
        type: DataTypes.ENUM,
        values: [
          "Sim/Não",
          "Texto",
          "Escala"
        ],
      },
      temPerguntaAdcionalSim: {
        type: DataTypes.ENUM,
        values: [
          "Sim",
          "Não"
        ],
      },
      perguntaAdcionalSim: {
        type: DataTypes.TEXT,
      },
      temPerguntaAdcionalNao: {
        type: DataTypes.ENUM,
        values: [
          "Sim",
          "Não"
        ],
      },
      perguntaAdcionalNao: {
        type: DataTypes.TEXT,
      },
      discPergunta1: {
        type: DataTypes.TEXT,
      },
      discPergunta2: {
        type: DataTypes.TEXT,
      },
      discPergunta3: {
        type: DataTypes.TEXT,
      },
      discPergunta4: {
        type: DataTypes.TEXT,
      },
      ordem: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {

        }
      },
      tipoDisc: {
        type: DataTypes.ENUM,
        values: [
          "Somar",
          "Subtrair"
        ],
      },
      tamanhoEscala: {
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

  questionarioPergunta.associate = (models) => {
    models.questionarioPergunta.belongsTo(models.questionario, {
      as: 'questionario',
      constraints: false,
    });

    models.questionarioPergunta.hasMany(models.file, {
      as: 'foto',
      foreignKey: 'belongsToId',
      constraints: false,
      scope: {
        belongsTo: models.questionarioPergunta.getTableName(),
        belongsToColumn: 'foto',
      },
    });
    
    models.questionarioPergunta.belongsTo(models.tenant, {
      as: 'tenant',
    });

    models.questionarioPergunta.belongsTo(models.user, {
      as: 'createdBy',
    });

    models.questionarioPergunta.belongsTo(models.user, {
      as: 'updatedBy',
    });
  };

  return questionarioPergunta;
}
