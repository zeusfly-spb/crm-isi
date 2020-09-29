'use strict';
const withPagination = require('sequelize-pagination');
const moment = require('moment')
const options = {
    methodName: 'paginate',
    primaryKey: 'id'
}
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Lead extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
        Lead.hasMany(models.LeadComment, {
          foreignKey: 'lead_id',
          as: 'comments'
        })
        Lead.belongsTo(models.User, {
          foreignKey: 'user_id',
          as: 'user'
        })
        Lead.hasOne(models.Appointment, {
            foreignKey: 'lead_id',
            as: 'event'
        })
        Lead.hasMany(models.Postpone, {
            foreignKey: 'lead_id',
            as: 'postpones'
        })
    }
  }
  Lead.init({
      id: { type: DataTypes.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true, allowNull: false },
      name: { type: DataTypes.STRING },
      phone: { type: DataTypes.STRING },
      site: { type: DataTypes.STRING },
      status: { type: DataTypes.ENUM('wait', 'process', 'moderate', 'done') },
      user_id: { type: DataTypes.BIGINT.UNSIGNED },
      calls: { type: DataTypes.TEXT },
      appointment_id: {type: DataTypes.BIGINT.UNSIGNED},
      last_postpone: {
          type: DataTypes.VIRTUAL,
          get () {
              return this.postpones.length && this.postpones[this.postpones.length - 1] || null
          },
          set () {
              throw new Error('Do not try to set the `last_postpone` value!')
          }
      },
      last_postpone_date: {
          type: DataTypes.VIRTUAL,
          get () {
              let postpone = this.postpones.length && this.postpones[this.postpones.length - 1]
              return postpone && moment(postpone.date).format('YYYY-MM-DD') || null
          },
          set () {
              throw new Error('Do not try to set the `last_postpone_date` value!')
          }
      }
  }, {
    sequelize,
    modelName: 'Lead',
    tableName: 'leads',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  withPagination(options)(Lead)
  return  Lead;
};
