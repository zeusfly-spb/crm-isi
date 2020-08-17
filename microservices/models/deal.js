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
      Deal.belongsTo(models.DealAction, {
        foreignKey: 'deal_action_id',
        as: 'action'
      })
    }
  }
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
    expense: DataTypes.INTEGER,
    action_type: {
      type: DataTypes.VIRTUAL,
      get () {
        return !!this.action && this.action.type || ''
      },
      set (val) {
        throw new Error('Do not try to set the `action_type` value!')
      }
    }
  }, {
    sequelize,
    modelName: 'Deal',
    tableName: 'deals',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  return Deal;
};
