'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class OtpToken extends Model {
    static associate(models) {
      OtpToken.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    }
  }
  OtpToken.init({
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    otp: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    is_used: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    sequelize,
    modelName: 'OtpToken',
    tableName: 'otp_tokens',
    timestamps: false,
  });
  return OtpToken;
};