import { DataTypes } from 'sequelize';

/**
 * ProgramaAtividadeItem database model.
 * See https://sequelize.org/v5/manual/models-definition.html to learn how to customize it.
 */
export default function (sequelize) {
  const programaAtividadeItem = sequelize.define(
    'programaAtividadeItem',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      item: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: true,
        }
      },
      pontos: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {

        }
      },
      dia: {
        type: DataTypes.INTEGER,
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

  programaAtividadeItem.associate = (models) => {
    models.programaAtividadeItem.belongsTo(models.programaAtividade, {
      as: 'programaAtividade',
      constraints: false,
    });

    models.programaAtividadeItem.belongsToMany(models.cliente, {
      as: 'cliente',
      constraints: false,
      through: 'programaAtividadeItemClienteCliente',
    });


    
    models.programaAtividadeItem.belongsTo(models.tenant, {
      as: 'tenant',
    });

    models.programaAtividadeItem.belongsTo(models.user, {
      as: 'createdBy',
    });

    models.programaAtividadeItem.belongsTo(models.user, {
      as: 'updatedBy',
    });
  };

  return programaAtividadeItem;
}
