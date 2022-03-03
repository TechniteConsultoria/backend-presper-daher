import { DataTypes } from 'sequelize';
import moment from 'moment';

/**
 * Avaliacao database model.
 * See https://sequelize.org/v5/manual/models-definition.html to learn how to customize it.
 */
export default function (sequelize) {
  const avaliacaoQuestionarioQuestionario = sequelize.define(
    'avaliacaoQuestionarioQuestionario',
    {
      avaliacaoId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: false,
      },
      questionarioId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: false,
      },

    },
    {
      freezeTableName: true,
    }
  );

  avaliacaoQuestionarioQuestionario.associate = (models) => {

  };

  return avaliacaoQuestionarioQuestionario;
}
