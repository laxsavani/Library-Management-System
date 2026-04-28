'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Fine extends Model {
    static associate(models) {
      Fine.belongsTo(models.BorrowRecord, { foreignKey: 'borrow_record_id', as: 'borrowRecord' });
      Fine.belongsTo(models.User, { foreignKey: 'student_id', as: 'student' });
    }
  }
  Fine.init({
    borrow_record_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    student_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('unpaid', 'paid'),
      defaultValue: 'unpaid',
    },
    paid_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  }, {
    sequelize,
    modelName: 'Fine',
    tableName: 'fines',
    timestamps: true,
  });
  return Fine;
};