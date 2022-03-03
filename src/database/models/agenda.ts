import { DataTypes } from 'sequelize';

/**
 * Agenda database model.
 * See https://sequelize.org/v5/manual/models-definition.html to learn how to customize it.
 */
export default function (sequelize) {
  const agenda = sequelize.define(
    'agenda',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      dataAgendada: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      dataConsulta: {
        type: DataTypes.DATE,
      },
      statusConsulta: {
        type: DataTypes.ENUM,
        values: [
          "Aguardando_Confirmação",
          "Confirmada",
          "Recusada",
          "Concluída",
          "Cancelada",
          "Remarcada"
        ],
      },
      notificacao: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
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

  agenda.associate = (models) => {
    models.agenda.belongsTo(models.user, {
      as: 'nutricionista',
      constraints: false,
    });

    models.agenda.belongsTo(models.cliente, {
      as: 'cliente',
      constraints: false,
    });

    models.agenda.belongsTo(models.avaliacao, {
      as: 'avaliacao',
      constraints: false,
    });


    
    models.agenda.belongsTo(models.tenant, {
      as: 'tenant',
    });

    models.agenda.belongsTo(models.user, {
      as: 'createdBy',
    });

    models.agenda.belongsTo(models.user, {
      as: 'updatedBy',
    });
    models.agenda.belongsTo(models.notificacaoCliente, {
      as: 'notificacaoCliente',
      constraints: false,
    })
  };

  return agenda;
}
