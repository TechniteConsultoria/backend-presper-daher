import { DataTypes } from 'sequelize';

export default function (sequelize) {
  const produtoModulo = sequelize.define(
    'produtoModulo',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      nome: {
        type: DataTypes.TEXT,
      },

      titulo: {
        type: DataTypes.TEXT,
      },

      url: {
        type: DataTypes.TEXT,
      },

      ordem: {
        type: DataTypes.TEXT,
      },

      importHash: {
        type: DataTypes.STRING(255),
        allowNull: true,
        validate: {
          len: [0, 255],
        },
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

  produtoModulo.associate = (models) => {

    models.produtoModulo.belongsTo(models.produto, {
      as: 'produto',
      constraints: false,
    });

    models.produtoModulo.belongsTo(models.tenant, {
      as: 'tenant',
      foreignKey: {
        allowNull: false,
      },
    });

    models.produtoModulo.belongsTo(models.user, {
      as: 'createdBy',
    });

    models.produtoModulo.belongsTo(models.user, {
      as: 'updatedBy',
    });
  };

  return produtoModulo;
}
