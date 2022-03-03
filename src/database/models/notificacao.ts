import { DataTypes } from 'sequelize';

/**
 * Notificacao database model.
 * See https://sequelize.org/v5/manual/models-definition.html to learn how to customize it.
 */
export default function (sequelize) {
  const notificacao = sequelize.define(
    'notificacao',
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
      notificacao: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: true,
        }
      },
      data: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      importHash: {
        type: DataTypes.STRING(255),
        allowNull: true,        
      },
      destinatarios:{
        type: DataTypes.STRING,
        allowNull: true,
      },
      enviado: {
        type: DataTypes.ENUM,
        values: [
          "Sim",
          "Não"
        ],
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

  notificacao.associate = (models) => {



    
    models.notificacao.belongsTo(models.tenant, {
      as: 'tenant',
    });

    models.notificacao.belongsTo(models.user, {
      as: 'createdBy',
    });

    models.notificacao.belongsTo(models.user, {
      as: 'updatedBy',
    });
  };

  return notificacao;
}
