'use strict';
const moment = require('moment')
const {v4} = require('uuid')
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Certificate extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Certificate.init({
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    customer_id: {type: DataTypes.BIGINT, allowNull: false},
    nominal: {type: DataTypes.INTEGER, allowNull: false},
    start_date: {type: DataTypes.DATEONLY, allowNull: false},
    duration: {type: DataTypes.INTEGER, allowNull: false},
    history: DataTypes.JSON,
    comments: {
      type: DataTypes.VIRTUAL,
      get () {
        return this.history && this.history.comments || []
      },
      set () {
        throw new Error('Do not try to set the `comments` value!')
      }
    },
    writeoffs: {
      type: DataTypes.VIRTUAL,
      get () {
        return this.history && this.history.writeoffs || []
      },
      set () {
        throw new Error('Do not try to set the `writeoffs` value!')
      }
    }
  }, {
    sequelize,
    modelName: 'Certificate',
    tableName: 'certificates',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  Certificate.prototype.addComment = function ({text = '', user_id = 0}) {
    if (!text.length) {
      return new Error('Comment text length can`t be 0')
    }
    const before = this.comments
    const comment = {
      id: v4(),
      text,
      user_id,
      created_at: moment().format('YYYY-MM-DD HH:mm:ss')
    }
    const after = [...before, comment]
    this.update({history: {... this.history, comments: after}})
  }
  Certificate.prototype.deleteComment = function ({id = null}) {
    if (!id || !this.comments.length) {
      return new Error('Can`t delete certificates comment')
    }
    this.update({history: {... this.history, comments: this.comments.filter(item => item.id !== id)}})
  }
  Certificate.prototype.addWriteoff = function ({amount, user_id}) {
    try {
      [amount, user_id].forEach(item => {
        if (!item) {
          throw new Error(`Not enough data item`)
        }
      })
      const newWriteoff = {
        amount,
        user_id,
        id: v4(),
        created_at: moment().format('YYYY-MM-DD HH:mm:ss')
      }
      this.update({history: {... this.history, writeoffs: [...this.writeoffs, newWriteoff]}})
    } catch (e) {
      return new Error(`Error adding writeoff into certificate: ${e}`)
    }
  }
  Certificate.prototype.deleteWriteoff = function ({id = null}) {
    try {
      this.update({history: {... this.history, writeoffs: this.writeoffs.filter(item => item.id !== id)}})
    } catch (e) {
      return new Error(`Error deleting writeoff from certificate ${e}`)
    }
  }
  return Certificate;
};