'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.belongsToMany(models.Role, { through: models.RoleData, foreignKey: 'user_id', otherKey: 'role_id' });
      User.hasMany(models.RoleData, { foreignKey: 'user_id', as: 'userRoles' });
      User.hasMany(models.BorrowRecord, { foreignKey: 'student_id', as: 'borrowRecords' });
      User.hasMany(models.Fine, { foreignKey: 'student_id', as: 'fines' });
      User.hasMany(models.Reservation, { foreignKey: 'student_id', as: 'reservations' });
      User.hasMany(models.Review, { foreignKey: 'student_id', as: 'reviews' });
      User.hasMany(models.OtpToken, { foreignKey: 'user_id', as: 'otpTokens' });
    }
  }
  User.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: true,
  });
  return User;
};