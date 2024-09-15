// models/order.model.js
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Order = sequelize.define("order", {
    order_id: {
      type: DataTypes.STRING(20),
      allowNull: false,
      primaryKey: true,
    },
    weight: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    karat: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    karigar_id: {
      type: DataTypes.INTEGER,
      allowNull: true, // Allow null because it will be set to null on delete
      references: {
        model: "karigars", // Foreign key to the karigars table
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL", // Set to null if the referenced karigar is deleted
    },
    placed_by: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    order_for: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    placed_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    delivery_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  });

  return Order;
};
