const db = require("../models"); // Assuming you've defined your Sequelize models in a `models` folder
const Order = db.order; // Assuming the model is named 'OrderDetails'
const OrderImage = db.orderImage;
const Karigar = db.karigar;
// Create a new order
exports.createOrder = async (req, res) => {
  try {
    const {
      order_id,
      weight,
      karat,
      description,
      karigar_id,
      placed_by,
      order_for,
      placed_date,
      delivery_date,
      active,
      images, // Expecting an array of image URLs
    } = req.body;

    // Create and save the order in the database
    const newOrder = await Order.create({
      order_id,
      weight,
      karat,
      description,
      karigar_id,
      placed_by,
      order_for,
      placed_date,
      delivery_date,
      active,
    });

    // Save images
    if (images && images.length > 0) {
      const imageEntries = images.map((imageUrl) => ({
        images: imageUrl,
        order_id: newOrder.order_id,
      }));
      await OrderImage.bulkCreate(imageEntries);
    }

    res.status(201).send(newOrder);
  } catch (error) {
    res.status(500).send({
      message: error.message || "Some error occurred while creating the order.",
    });
  }
};

// controllers/order.controller.js
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [
        {
          model: OrderImage,
          as: "order_images", // Ensure this alias matches what you used in your model definition
          attributes: ["id", "images"], // Adjust attributes as needed
        },
        {
          model: Karigar,
          as: "karigar", // Ensure this alias matches what you used in your model definition
          attributes: ["id", "name", "description"], // Adjust attributes as needed
        },
      ],
    });

    res.status(200).send(orders);
  } catch (error) {
    res.status(500).send({
      message:
        error.message || "Some error occurred while retrieving the orders.",
    });
  }
};

exports.updateOrder = async (req, res) => {
  try {
    const {
      order_id,
      weight,
      karat,
      description,
      karigar_id,
      placed_by,
      order_for,
      placed_date,
      delivery_date,
      active,
      images, // Expecting an array of image URLs
    } = req.body;

    // Update order
    const [updated] = await Order.update(
      {
        weight,
        karat,
        description,
        karigar_id,
        placed_by,
        order_for,
        placed_date,
        delivery_date,
        active,
      },
      {
        where: { order_id },
      }
    );

    if (!updated) {
      return res.status(404).send({
        message: "Order not found.",
      });
    }

    // Update images
    if (images && images.length > 0) {
      await OrderImage.destroy({ where: { order_id } }); // Remove existing images
      const imageEntries = images.map((imageUrl) => ({
        images: imageUrl,
        order_id,
      }));
      await OrderImage.bulkCreate(imageEntries);
    }

    res.status(200).send({ message: "Order updated successfully." });
  } catch (error) {
    res.status(500).send({
      message: error.message || "Some error occurred while updating the order.",
    });
  }
};

exports.deleteOrder = async (req, res) => {
  const { order_id } = req.params; // Get the order_id from request parameters

  try {
    // Check if the order exists
    const order = await Order.findOne({ where: { order_id } });
    if (!order) {
      return res.status(404).send({
        message: "Order not found.",
      });
    }

    // Delete associated images
    await OrderImage.destroy({ where: { order_id } });

    // Delete the order
    await Order.destroy({ where: { order_id } });

    res.status(200).send({
      message: "Order and associated images deleted successfully.",
    });
  } catch (error) {
    res.status(500).send({
      message: error.message || "Some error occurred while deleting the order.",
    });
  }
};
