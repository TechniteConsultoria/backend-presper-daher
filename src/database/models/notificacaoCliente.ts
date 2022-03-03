import { DataTypes } from 'sequelize';

/**
 * notificacaoCliente database model.
 * See https://sequelize.org/v5/manual/models-definition.html to learn how to customize it.
 */
export default function (sequelize) {
  const notificacaoCliente = sequelize.define(
    'notificacaoCliente',
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
      ultima: {
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

  notificacaoCliente.associate = (models) => {
    models.notificacaoCliente.belongsTo(models.cliente, {
      as: 'cliente',
      constraints: false,
    });
  };

  return notificacaoCliente;
}
