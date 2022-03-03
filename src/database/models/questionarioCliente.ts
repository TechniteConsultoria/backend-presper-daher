import { DataTypes } from 'sequelize';

/**
 * QuestionarioCliente database model.
 * See https://sequelize.org/v5/manual/models-definition.html to learn how to customize it.
 */
export default function (sequelize) {
  const questionarioCliente = sequelize.define(
    'questionarioCliente',
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

  questionarioCliente.associate = (models) => {
    models.questionarioCliente.belongsTo(models.cliente, {
      as: 'cliente',
      constraints: false,
    });

    models.questionarioCliente.belongsTo(models.questionario, {
      as: 'questionario',
      constraints: false,
    });

    models.questionarioCliente.belongsTo(models.avaliacao, {
      as: 'avaliacao',
      constraints: false,
    });


    
    models.questionarioCliente.belongsTo(models.tenant, {
      as: 'tenant',
    });

    models.questionarioCliente.belongsTo(models.user, {
      as: 'createdBy',
    });

    models.questionarioCliente.belongsTo(models.user, {
      as: 'updatedBy',
    });
  };

  return questionarioCliente;
}
