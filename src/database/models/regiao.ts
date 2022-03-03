import { DataTypes } from 'sequelize';

/**
 * Regiao database model.
 * See https://sequelize.org/v5/manual/models-definition.html to learn how to customize it.
 */
export default function (sequelize) {
  const regiao = sequelize.define(
    'regiao',
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
      uf: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: true,
        }
      },
      cidade: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: true,
        }
      },
      descricao: {
        type: DataTypes.TEXT,
        allowNull: true,
        validate: {
          notEmpty: true,
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

  regiao.associate = (models) => {
    models.regiao.belongsTo(models.afiliados, {
      as: 'afiliado',
      constraints: false,
    });


    
    models.regiao.belongsTo(models.tenant, {
      as: 'tenant',
    });

    models.regiao.belongsTo(models.user, {
      as: 'createdBy',
    });

    models.regiao.belongsTo(models.user, {
      as: 'updatedBy',
    });
  };

  return regiao;
}
