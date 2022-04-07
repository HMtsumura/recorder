'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Content extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Content.belongsTo(models.Category);
    }
  }
  Content.init({
    user_id: DataTypes.INTEGER,
    category_id: DataTypes.INTEGER,
    title_id: DataTypes.INTEGER,
    comment: DataTypes.STRING,
    record_ymd: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Content',
  });
  return Content;
};