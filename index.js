const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./models/index");
const authRoutes = require("./routes/auth.routes");
const orderRoutes = require("./routes/order.routes");
const karigarRoutes = require("./routes/karigar.routes");

const app = express();

app.use(cors());
app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api", orderRoutes);
app.use("/api", karigarRoutes);

db.sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("Tables updated successfully");
  })
  .catch((err) => {
    console.error("Error updating tables:", err);
  });

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
