// models/karigar.model.js
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Karigar = sequelize.define("karigar", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });

  return Karigar;
};
