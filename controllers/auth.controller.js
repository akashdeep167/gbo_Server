const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const Role = db.role;
const Op = db.Sequelize.Op;

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.signup = async (req, res) => {
  try {
    // Validate request
    if (!req.body.username || !req.body.password) {
      return res
        .status(400)
        .json({ message: "Username and password are required." });
    }
    req.body.username = req.body.username.trim();

    // Create User
    const user = await User.create({
      username: req.body.username,
      password: bcrypt.hashSync(req.body.password, 10), // Use a higher salt rounds value for better security
    });

    // Assign Roles
    if (req.body.roles && Array.isArray(req.body.roles)) {
      const roles = await Role.findAll({
        where: {
          name: {
            [Op.or]: req.body.roles,
          },
        },
      });
      await user.setRoles(roles);
    } else {
      // Default role (ensure this matches your default role ID)
      await user.setRoles([1]);
    }

    res.status(200).json({ message: "User was registered successfully!" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.signin = async (req, res) => {
  try {
    // Validate request
    if (!req.body.username || !req.body.password) {
      return res
        .status(400)
        .json({ message: "Username and password are required." });
    }
    const trimmedUsername = req.body.username.trim();
    // Find User
    const user = await User.findOne({
      where: { username: trimmedUsername },
    });

    if (!user) {
      return res.status(404).send({ message: "User Not found." });
    }

    // Check Password
    const passwordIsValid = bcrypt.compareSync(
      req.body.password,
      user.password
    );

    if (!passwordIsValid) {
      return res.status(401).send({
        accessToken: null,
        message: "Invalid Password!",
      });
    }

    // Fetch Roles
    const roles = await user.getRoles(); // Get associated roles
    const authorities = roles.map((role) => role.name);

    // Check if the user is an admin
    const isAdmin = authorities.includes("admin");

    // Create Token
    const token = jwt.sign(
      { id: user.id, username: user.username, isAdmin },
      config.secret,
      {
        algorithm: "HS256",
        expiresIn: 86400, // 24 hours
      }
    );

    res.status(200).send({
      accessToken: token,
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["id", "username"], // Select only necessary fields
      include: [
        {
          model: Role,
          as: "roles",
          attributes: ["name"], // Include role names
        },
      ],
    });
    const usersWithRoles = users.map((user) => ({
      id: user.id,
      username: user.username,
      roles: user.roles.map((role) => role.name), // Extract role names
    }));
    res.status(200).send(usersWithRoles);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { username, password, roles } = req.body;

    // Validate input
    if (!username && !password && !roles) {
      return res.status(400).send({ message: "No fields to update." });
    }

    // Find the user by ID
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).send({ message: "User not found." });
    }

    // Update username and password if provided
    if (username) user.username = username;
    if (password) user.password = bcrypt.hashSync(password, 10);

    // Update roles if provided
    if (roles && Array.isArray(roles)) {
      const foundRoles = await Role.findAll({
        where: {
          name: {
            [Op.or]: roles,
          },
        },
      });
      await user.setRoles(foundRoles);
    }

    // Save the user
    await user.save();

    res.status(200).send({ message: "User updated successfully." });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find the user by ID
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).send({ message: "User not found." });
    }

    // Delete the user
    await user.destroy();

    res.status(200).send({ message: "User deleted successfully." });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};
