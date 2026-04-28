'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Book extends Model {
    static associate(models) {
      Book.hasMany(models.BorrowRecord, { foreignKey: 'book_id', as: 'borrowRecords' });
      Book.hasMany(models.Reservation, { foreignKey: 'book_id', as: 'reservations' });
      Book.hasMany(models.Review, { foreignKey: 'book_id', as: 'reviews' });
      Book.belongsTo(models.Category, { foreignKey: 'category_id', as: 'category' });
    }
  }
  Book.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isbn: {
      type: DataTypes.STRING,
      unique: true,
    },
    category_id: {
      type: DataTypes.INTEGER,
    },
    total_copies: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    avail_copies: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    cover_image: {
      type: DataTypes.STRING,
    },
    cover_public_id: {
      type: DataTypes.STRING,
    },
  }, {
    sequelize,
    modelName: 'Book',
    tableName: 'books',
    timestamps: true,
  });
  return Book;
};