import { DataTypes } from 'sequelize';

export default function (sequelize) {
  const perguntas = sequelize.define(
    'perguntas',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      dataMensagem: {
        type: DataTypes.DATE,
      },
      email:{
        type: DataTypes.TEXT,
      }, 
      nome:{
        type: DataTypes.TEXT,
      },
      telefone:{
        type: DataTypes.TEXT,
      },
      mensagem:{
        type: DataTypes.TEXT,
      },
      resposta:{
        type: DataTypes.TEXT,
      },
    },
    {
      indexes: [
        {
          unique: false,
          fields: ['id', 'tenantId'],
          where: {
            deletedAt: null,
          },
        },

      ],
      timestamps: true,
      paranoid: true,
    },
  );

  perguntas.associate = (models) => {
    models.perguntas.belongsTo(models.user, {
      as: 'user',
      constraints: false,
    });

    models.perguntas.belongsTo(models.empresa, {
      as: 'fornecedorEmpresa',
      constraints: false,
    });

    models.perguntas.belongsTo(models.produto, {
        as: 'produto',
        constraints: false,
      });

    models.perguntas.belongsTo(models.tenant, {
      as: 'tenant',
      foreignKey: {
        allowNull: false,
      },
    });

    models.perguntas.belongsTo(models.user, {
      as: 'createdBy',
    });

    models.perguntas.belongsTo(models.user, {
      as: 'updatedBy',
    });
  };

  return perguntas;
}
