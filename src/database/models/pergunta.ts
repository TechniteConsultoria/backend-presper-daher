import { DataTypes } from 'sequelize';
import moment from 'moment';

/**
 * Pergunta database model.
 * See https://sequelize.org/v5/manual/models-definition.html to learn how to customize it.
 */
export default function (sequelize) {
  const pergunta = sequelize.define(
    'pergunta',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      dataPergunta: {
        type: DataTypes.DATEONLY,
        get: function() {
          // @ts-ignore
          return this.getDataValue('dataPergunta')
            ? moment
                // @ts-ignore
                .utc(this.getDataValue('dataPergunta'))
                .format('YYYY-MM-DD')
            : null;
        },
      },
      perguntaNutri: {
        type: DataTypes.TEXT,
      },
      resposta: {
        type: DataTypes.TEXT,
      },
      notificacao: {
        type: DataTypes.BOOLEAN,
      },
      notificacaoOffice: {
        type: DataTypes.BOOLEAN,        
      }
    },
    {
      timestamps: true,
      paranoid: true,
    },
  );

  pergunta.associate = (models) => {
    models.pergunta.belongsTo(models.avaliacao, {
        as: 'avaliacao',
    })
    
    models.pergunta.belongsTo(models.tenant, {
      as: 'tenant',
    });

    models.pergunta.belongsTo(models.user, {
      as: 'createdBy',
    });

    models.pergunta.belongsTo(models.user, {
      as: 'updatedBy',
    });
  };

  return pergunta;
}
