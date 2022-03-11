import { DataTypes } from 'sequelize';

export default function (sequelize) {
  const clienteProdutoCertificado = sequelize.define(
    'clienteProdutoCertificado',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      quantidade: {
        type: DataTypes.INTEGER,
      },
      precoUnitario: {
        type: DataTypes.DECIMAL(10, 2),
      },
      precoTotal: {
        type: DataTypes.DECIMAL(10, 2),
      },
      isCertificado:{
        type: DataTypes.BOOLEAN,
      },
      isPago:{
        type: DataTypes.BOOLEAN,
      },
      dataInicio:{
        type: DataTypes.DATE,
      },
      dataTermino:{
        type: DataTypes.DATE,
      }
     
    },
    {
      indexes: [
        {
          unique: false,
          fields: ['produtoId'],
          where: {
            deletedAt: null,
          },
        },
      ],
      timestamps: true,
      paranoid: true,
    },
  );

  clienteProdutoCertificado.associate = (models) => {

    models.clienteProdutoCertificado.belongsTo(models.user, {
      as: 'user',
      constraints: false,
      unique: false,
    });
    models.clienteProdutoCertificado.belongsTo(models.produto, {
        as: 'produto',
        constraints: false,
        unique: false,
      });


  };

  return clienteProdutoCertificado;
}
