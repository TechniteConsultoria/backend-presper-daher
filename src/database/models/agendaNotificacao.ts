import { DataTypes } from 'sequelize';

/**
 * agendaNotificacao database model.
 * See https://sequelize.org/v5/manual/models-definition.html to learn how to customize it.
 */
export default function (sequelize) {
  const agendaNotificacao = sequelize.define(
    'agendaNotificacao',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      token: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: true,
        }
      },
      dataEnvio: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          notEmpty: true,
        }
      },      
    },
    {
      indexes: [],
      timestamps: false,
      paranoid: false,
    },
  );

  agendaNotificacao.associate = (models) => {
    models.agendaNotificacao.belongsTo(models.cliente, {
      as: 'cliente',
      constraints: false,
    });
  };

  return agendaNotificacao;
}
