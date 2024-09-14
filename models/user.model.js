module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("users", {
    id: {
      type: Sequelize.INTEGER(11), // Define as INT(11)
      primaryKey: true, // Set as primary key
      autoIncrement: true, // Auto-increment the ID
      allowNull: false, // Make it non-nullable
    },
    username: {
      type: Sequelize.STRING(150), // Match VARCHAR(150)
      allowNull: false, // Make it required
      unique: true, // Set it as unique, similar to UNIQUE KEY
    },
    password: {
      type: Sequelize.STRING(128), // Match VARCHAR(128)
      allowNull: false, // Make it required
    },
  });

  return User;
};
