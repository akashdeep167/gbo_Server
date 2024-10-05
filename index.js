const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./models/index");
const authRoutes = require("./routes/auth.routes");
const orderRoutes = require("./routes/order.routes");
const karigarRoutes = require("./routes/karigar.routes");
const imageRoutes = require("./routes/image.routes");
const path = require("path");

const app = express();
app.use(express.static(path.join(__dirname, "client/build")));

app.use(cors());
app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/karigars", karigarRoutes);
app.use("/api/images", imageRoutes);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client/build", "index.html"));
});

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
