import { DataTypes } from 'sequelize';

/**
 * CursoClienteAula database model.
 * See https://sequelize.org/v5/manual/models-definition.html to learn how to customize it.
 */
export default function (sequelize) {
  const cursoClienteAula = sequelize.define(
    'cursoClienteAula',
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
      preco: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      jsonIugu: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      statusPgt: {
        type: DataTypes.TEXT,
        allowNull: false,
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

  cursoClienteAula.associate = (models) => {
    models.cursoClienteAula.belongsTo(models.cliente, {
      as: 'cliente',
      constraints: false,
    });

    models.cursoClienteAula.belongsTo(models.cursoAula, {
      as: 'aula',
      constraints: false,
    });


    
    models.cursoClienteAula.belongsTo(models.tenant, {
      as: 'tenant',
    });

    models.cursoClienteAula.belongsTo(models.user, {
      as: 'createdBy',
    });

    models.cursoClienteAula.belongsTo(models.user, {
      as: 'updatedBy',
    });
  };

  return cursoClienteAula;
}
