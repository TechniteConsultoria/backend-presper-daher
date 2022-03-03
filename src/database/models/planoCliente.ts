import { DataTypes } from 'sequelize';

/**
 * PlanoCliente database model.
 * See https://sequelize.org/v5/manual/models-definition.html to learn how to customize it.
 */
export default function (sequelize) {
  const planoCliente = sequelize.define(
    'planoCliente',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      data: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      valor: {
        type: DataTypes.DECIMAL(24, 2),
        allowNull: false,
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

  planoCliente.associate = (models) => {
    models.planoCliente.belongsTo(models.cliente, {
      as: 'cliente',
      constraints: false,
    });

    models.planoCliente.belongsTo(models.plano, {
      as: 'plano',
      constraints: false,
    });


    
    models.planoCliente.belongsTo(models.tenant, {
      as: 'tenant',
    });

    models.planoCliente.belongsTo(models.user, {
      as: 'createdBy',
    });

    models.planoCliente.belongsTo(models.user, {
      as: 'updatedBy',
    });
  };

  return planoCliente;
}
