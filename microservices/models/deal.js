'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Deal extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Deal.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user'
      })
      Deal.belongsTo(models.Customer, {
        foreignKey: 'customer_id',
        as: 'customer'
      })
    }
  };
  Deal.init({
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: DataTypes.BIGINT,
    island_id: DataTypes.BIGINT,
    customer_id: DataTypes.BIGINT,
    income: DataTypes.INTEGER,
    expense: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Deal',
    tableName: 'deals',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  return Deal;
};
