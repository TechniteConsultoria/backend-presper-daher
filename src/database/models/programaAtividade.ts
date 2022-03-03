import { DataTypes } from 'sequelize';

/**
 * ProgramaAtividade database model.
 * See https://sequelize.org/v5/manual/models-definition.html to learn how to customize it.
 */
export default function (sequelize) {
  const programaAtividade = sequelize.define(
    'programaAtividade',
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
      duracao: {
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

  programaAtividade.associate = (models) => {
    models.programaAtividade.belongsToMany(models.cliente, {
      as: 'cliente',
      constraints: false,
      through: 'programaAtividadeCliente',
    });

    models.programaAtividade.hasMany(models.programaAtividadeItem, {
      as: 'programaAtividadeItem',
      constraints: false,
    });

    models.programaAtividade.hasMany(models.file, {
      as: 'imagem',
      foreignKey: 'belongsToId',
      constraints: false,
      scope: {
        belongsTo: models.programaAtividade.getTableName(),
        belongsToColumn: 'imagem',
      },
    });
    
    models.programaAtividade.belongsTo(models.tenant, {
      as: 'tenant',
    });

    models.programaAtividade.belongsTo(models.user, {
      as: 'createdBy',
    });

    models.programaAtividade.belongsTo(models.user, {
      as: 'updatedBy',
    });
  };

  return programaAtividade;
}
