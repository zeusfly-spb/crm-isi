'use strict';
const withPagination = require('sequelize-pagination');
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
      appointment_id: {type: DataTypes.BIGINT.UNSIGNED}
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
