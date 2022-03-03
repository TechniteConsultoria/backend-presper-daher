import { DataTypes } from 'sequelize';
import moment from 'moment';

/**
 * Cliente database model.
 * See https://sequelize.org/v5/manual/models-definition.html to learn how to customize it.
 */
export default function (sequelize) {
  const cliente = sequelize.define(
    'cliente',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      cpf: {
        type: DataTypes.STRING(20),
        allowNull: false,
        validate: {

        }
      },
      nascimento: {
        type: DataTypes.DATEONLY,
        get: function() {
          // @ts-ignore
          return this.getDataValue('nascimento')
            ? moment
                // @ts-ignore
                .utc(this.getDataValue('nascimento'))
                .format('YYYY-MM-DD')
            : null;
        },
        allowNull: false,
      },
      nome: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: true,
        }
      },
      genero: {
        type: DataTypes.ENUM,
        allowNull: false,
        values: [
          "Masculino",
          "Feminino"
        ],
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
          //isEmail: true,
        }
      },
      emailVerificado: {
        type: DataTypes.TINYINT,
        defaultValue: 0,
        allowNull: false,
        
        validate: {
          notEmpty: true,
        }
      },
      senha: {
        type: DataTypes.STRING,
        defaultValue: "123456"
      },
      token: {
        type: DataTypes.STRING,
      },
      recuperarSenha: {
        type: DataTypes.STRING,
      },
      cep: {
        type: DataTypes.STRING(10),
        allowNull: false,
        validate: {

        }
      },
      whatsapp: {
        type: DataTypes.STRING(20),
        allowNull: false,
        validate: {

        }
      },
      telefone: {
        type: DataTypes.STRING(20),
      },
      uf: {
        type: DataTypes.STRING(2),
        validate: {

        }
      },
      cidade: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: true,
        }
      },
      bairro: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: true,
        }
      },
      logradouro: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: true,
        }
      },
      numero: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {

        }
      },
      complemento: {
        type: DataTypes.TEXT,
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

  cliente.associate = (models) => {


    models.cliente.hasMany(models.file, {
      as: 'foto',
      foreignKey: 'belongsToId',
      constraints: false,
      scope: {
        belongsTo: models.cliente.getTableName(),
        belongsToColumn: 'foto',
      },
    });

    models.cliente.belongsToMany(models.programaAtividade, {
      as: 'programaAtividade',
      constraints: false,
      through: 'programaAtividadeCliente',
    });
    
    models.cliente.belongsTo(models.tenant, {
      as: 'tenant',
    });

    models.cliente.belongsTo(models.user, {
      as: 'createdBy',
    });

    models.cliente.belongsTo(models.user, {
      as: 'updatedBy',
    });
  };

  return cliente;
}
