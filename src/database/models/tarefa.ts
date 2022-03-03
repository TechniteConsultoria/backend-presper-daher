import { DataTypes } from 'sequelize';
import moment from 'moment';

/**
 * Tarefa database model.
 * See https://sequelize.org/v5/manual/models-definition.html to learn how to customize it.
 */
export default function (sequelize) {
  const tarefa = sequelize.define(
    'tarefa',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      dataTarefa: {
        type: DataTypes.DATEONLY,
        get: function() {
          // @ts-ignore
          return this.getDataValue('dataTarefa')
            ? moment
                // @ts-ignore
                .utc(this.getDataValue('dataTarefa'))
                .format('YYYY-MM-DD')
            : null;
        },
      },
      nome: {
        type: DataTypes.TEXT,
      },
      status: {
        type: DataTypes.BOOLEAN,
        defaultValue: false, 
      },
    },
    {
      timestamps: true,
      paranoid: true,
    },
  );

  tarefa.associate = (models) => {
    models.tarefa.belongsTo(models.avaliacao, {
        as: 'avaliacao',
    })

    
    models.tarefa.belongsTo(models.tenant, {
      as: 'tenant',
    });

    models.tarefa.belongsTo(models.user, {
      as: 'createdBy',
    });

    models.tarefa.belongsTo(models.user, {
      as: 'updatedBy',
    });
  };

  return tarefa;
}
