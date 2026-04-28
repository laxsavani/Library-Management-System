'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RoleData extends Model {
    static associate(models) {
      RoleData.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
      RoleData.belongsTo(models.Role, { foreignKey: 'role_id', as: 'role' });
    }
  }
  RoleData.init({
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    role_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    assigned_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    sequelize,
    modelName: 'RoleData',
    tableName: 'role_data',
    timestamps: false,
  });
  return RoleData;
};