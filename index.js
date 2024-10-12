const https = require("https");
const fs = require("fs");
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

app.use(cors({ origin: "*" }));
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

// const httpsOptions = {
//   key: fs.readFileSync("/home/ubuntu/ssl/private/cert.key"),
//   cert: fs.readFileSync("/home/ubuntu/ssl/cert.pem"),
// };

const PORT = 3001;

// https.createServer(httpsOptions, app).listen(PORT, () => {
//   console.log(`HTTPS server is running on port ${PORT}`);
// });

app.listen(PORT, () => {
  console.log("server started: ", PORT);
})