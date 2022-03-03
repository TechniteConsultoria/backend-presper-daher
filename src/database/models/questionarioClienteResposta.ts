import { DataTypes } from 'sequelize';

/**
 * QuestionarioClienteResposta database model.
 * See https://sequelize.org/v5/manual/models-definition.html to learn how to customize it.
 */
export default function (sequelize) {
  const questionarioClienteResposta = sequelize.define(
    'questionarioClienteResposta',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      respostaPergunta: {
        type: DataTypes.TEXT,
      },
      respostaPerguntaSim: {
        type: DataTypes.TEXT,
      },
      respostaPerguntaNao: {
        type: DataTypes.TEXT,
      },
      respostaDisc1: {
        type: DataTypes.INTEGER,
      },
      respostaDisc2: {
        type: DataTypes.INTEGER,
      },
      respostaDisc3: {
        type: DataTypes.INTEGER,
      },
      respostaDisc4: {
        type: DataTypes.INTEGER,
      },
      respostaEscala: {
        type: DataTypes.INTEGER,
      },
     ordem: {
        type: DataTypes.INTEGER,
      },
      respostaEscalaTipo: {
        type: DataTypes.ENUM,
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
          fields: ['importHash'],
          where: {
            deletedAt: null,
          },
        },

      ],
      timestamps: true,
      paranoid: true,
    },
  );

  questionarioClienteResposta.associate = (models) => {
    models.questionarioClienteResposta.belongsTo(models.questionarioCliente, {
      as: 'questionarioCliente',
      constraints: false,
    });

    models.questionarioClienteResposta.belongsTo(models.questionarioPergunta, {
      as: 'pergunta',
      constraints: false,
    });

    models.questionarioClienteResposta.belongsTo(models.user, {
      as: 'createdBy',
    });

    models.questionarioClienteResposta.belongsTo(models.user, {
      as: 'updatedBy',
    });
  };

  return questionarioClienteResposta;
}
