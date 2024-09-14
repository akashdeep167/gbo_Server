module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("users", {
    id: {
      type: Sequelize.INTEGER(11), // Define it as INT(11)
      primaryKey: true, // Set it as the primary key
      autoIncrement: true, // Auto-increment the ID
      allowNull: false, // Make it non-nullable
    },
    username: {
      type: Sequelize.STRING,
      allowNull: false, // Optional: Make this field required
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false, // Optional: Make this field required
    },
  });

  return User;
};
