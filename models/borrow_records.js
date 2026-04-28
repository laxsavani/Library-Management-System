'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BorrowRecord extends Model {
    static associate(models) {
      BorrowRecord.belongsTo(models.User, { foreignKey: 'student_id', as: 'student' });
      BorrowRecord.belongsTo(models.Book, { foreignKey: 'book_id', as: 'book' });
      BorrowRecord.hasOne(models.Fine, { foreignKey: 'borrow_record_id', as: 'fine' });
    }
  }
  BorrowRecord.init({
    student_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    book_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    borrow_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    due_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    return_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('borrowed', 'returned'),
      defaultValue: 'borrowed',
    },
  }, {
    sequelize,
    modelName: 'BorrowRecord',
    tableName: 'borrow_records',
    timestamps: false,
  });
  return BorrowRecord;
};