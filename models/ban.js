'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Ban extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Ban.init({
    userId: DataTypes.INTEGER,
    unBannedTime: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Ban',
  });
  return Ban;
};