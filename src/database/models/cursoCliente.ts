import { DataTypes } from 'sequelize';
import { getConfig } from '../../config';

/**
 * CursoCliente database model.
 * See https://sequelize.org/v5/manual/models-definition.html to learn how to customize it.
 */
export default function (sequelize) {
  const cursoCliente = sequelize.define(
    'cursoCliente',
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
      jsonIugu: {
        type:
          // MySQL doesn't have Array Field
          getConfig().DATABASE_DIALECT === 'mysql'
            ? DataTypes.JSON
            : DataTypes.ARRAY(DataTypes.TEXT),
      },
      statusPgt: {
        type: DataTypes.TEXT,
        allowNull: false,
        defaultValue: 'não autorizado'
      },
      idIugu: {
        type: DataTypes.TEXT,
      }
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

  cursoCliente.associate = (models) => {
    models.cursoCliente.belongsTo(models.curso, {
      as: 'curso',
      constraints: false,
    });

    models.cursoCliente.belongsTo(models.cliente, {
      as: 'cliente',
      constraints: false,
    });


    
    models.cursoCliente.belongsTo(models.tenant, {
      as: 'tenant',
    });

    models.cursoCliente.belongsTo(models.user, {
      as: 'createdBy',
    });

    models.cursoCliente.belongsTo(models.user, {
      as: 'updatedBy',
    });
  };

  return cursoCliente;
}
