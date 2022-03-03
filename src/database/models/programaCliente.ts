import { DataTypes } from 'sequelize'
import moment from 'moment'

/**
 * ProgramaCliente database model.
 * See https://sequelize.org/v5/manual/models-definition.html to learn how to customize it.
 */
export default function (sequelize) {
  const programaCliente = sequelize.define(
    'programaCliente',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      dataInicio: {
        type: DataTypes.DATEONLY,
        get: function () {
          // @ts-ignore
          return this.getDataValue('dataInicio')
            ? moment
                // @ts-ignore
                .utc(this.getDataValue('dataInicio'))
                .format('YYYY-MM-DD')
            : null
        },
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
  )

  programaCliente.associate = (models) => {
    models.programaCliente.belongsTo(models.cliente, {
      as: 'cliente',
      constraints: false,
    })

    models.programaCliente.belongsTo(models.tenant, {
      as: 'tenant',
    })

    models.programaCliente.belongsTo(models.user, {
      as: 'createdBy',
    })

    models.programaCliente.belongsTo(models.user, {
      as: 'updatedBy',
    })

    models.programaCliente.belongsTo(models.programa, {
      as: 'programa',
      constraints: false,
    })

    models.programaCliente.hasMany(models.file, {
      as: 'audio',
      foreignKey: 'belongsToId',
      constraints: false,
      scope: {
        belongsTo: models.programaCliente.getTableName(),
        belongsToColumn: 'audio',
      },
    })
  }

  return programaCliente
}
