// models/orderImage.model.js
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const OrderImage = sequelize.define(
    "order_images", // Table name
    {
      id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },
      images: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      order_id: {
        type: DataTypes.STRING(20),
        allowNull: false,
        references: {
          model: "orders", // Foreign key to the orders table
          key: "order_id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
    }
  );

  return OrderImage;
};
