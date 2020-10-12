'use strict';
const moment = require('moment')
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Subscribe extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Subscribe.belongsTo(models.Subscription, {
        foreignKey: 'subscription_id',
        as: 'subscription'
      })
    }
  };
  Subscribe.init({
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    island_id: {type: DataTypes.BIGINT, allowNull: false},
    subscription_id: {type: DataTypes.BIGINT, allowNull: false},
    customer_id: {type: DataTypes.BIGINT, allowNull: false},
    user_id: {type: DataTypes.BIGINT, allowNull: false},
    start_date: {type: DataTypes.DATEONLY, allowNull: false},
    supply_count: {type: DataTypes.INTEGER, allowNull: false},
    comments: DataTypes.JSON,
    finish_date: {
      type: DataTypes.VIRTUAL,
      get () {
        return moment(this.start_date)
            .add(this.subscription && this.subscription.number_days || 0, 'days')
            .format('YYYY-MM-DD')
      },
      set () {
        throw new Error('Do not try to set the `finish_date` value!')
      }
    },
    start_month: {
      type: DataTypes.VIRTUAL,
      get () {
        return moment(this.start_date).format('YYYY-MM')
      },
      set () {
        throw new Error('Do not try to set the `start_month` value!')
      }
    },
    finish_month: {
      type: DataTypes.VIRTUAL,
      get () {
        return this.finish_date && moment(this.finish_date).format('YYYY-MM') || null
      },
      set () {
        throw new Error('Do not try to set the `finish_month` value!')
      }
    }
  }, {
    sequelize,
    modelName: 'Subscribe',
    tableName: 'subscribes',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  return Subscribe;
};
