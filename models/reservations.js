'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Reservation extends Model {
    static associate(models) {
      Reservation.belongsTo(models.User, { foreignKey: 'student_id', as: 'student' });
      Reservation.belongsTo(models.Book, { foreignKey: 'book_id', as: 'book' });
    }
  }
  Reservation.init({
    student_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    book_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('pending', 'fulfilled', 'cancelled'),
      defaultValue: 'pending',
    },
    reserved_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'Reservation',
    tableName: 'reservations',
    timestamps: false,
  });
  return Reservation;
};