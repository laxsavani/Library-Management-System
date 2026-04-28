'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    static associate(models) {
      Role.belongsToMany(models.User, { through: models.RoleData, foreignKey: 'role_id', otherKey: 'user_id' });
      Role.hasMany(models.RoleData, { foreignKey: 'role_id', as: 'roleUsers' });
    }
  }
  Role.init({
    role_name: {
      type: DataTypes.ENUM('admin', 'librarian', 'student'),
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
    },
  }, {
    sequelize,
    modelName: 'Role',
    tableName: 'roles',
    timestamps: false,
  });
  return Role;
};