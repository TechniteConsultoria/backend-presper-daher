import { DataTypes } from 'sequelize';

/**
 * DicaReceita database model.
 * See https://sequelize.org/v5/manual/models-definition.html to learn how to customize it.
 */
export default function (sequelize) {
  const dicaReceita = sequelize.define(
    'dicaReceita',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      tipo: {
        type: DataTypes.ENUM,
        allowNull: false,
        values: [
          "Dica",
          "Receita",
          "Pilula",
          "Produto"
        ],
      },
      urlVideo: {
        type: DataTypes.TEXT,
      },
      nome: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: true,
        }
      },
      texto: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: true,
        }
      },
      dataListagem: {
        type: DataTypes.DATE,
      },
      importHash: {
        type: DataTypes.STRING(255),
        allowNull: true,        
      },
      destinatarios:{
        type: DataTypes.STRING,
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

  dicaReceita.associate = (models) => {


    models.dicaReceita.hasMany(models.file, {
      as: 'imagem',
      foreignKey: 'belongsToId',
      constraints: false,
      scope: {
        belongsTo: models.dicaReceita.getTableName(),
        belongsToColumn: 'imagem',
      },
    });
    
    models.dicaReceita.belongsTo(models.tenant, {
      as: 'tenant',
    });

    models.dicaReceita.belongsTo(models.user, {
      as: 'createdBy',
    });

    models.dicaReceita.belongsTo(models.user, {
      as: 'updatedBy',
    });
  };

  return dicaReceita;
}
