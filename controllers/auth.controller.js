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

    // Find User
    const user = await User.findOne({
      where: { username: req.body.username },
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

    // Create Token
    const token = jwt.sign({ id: user.id }, config.secret, {
      algorithm: "HS256",
      expiresIn: 86400, // 24 hours
    });

    // Fetch Roles
    const roles = await user.getRoles();
    const authorities = roles.map((role) => role.name);

    res.status(200).send({
      id: user.id,
      username: user.username,
      roles: authorities,
      accessToken: token,
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};
