module.exports = {
  HOST: "localhost",
  USER: "root",
  PASSWORD: "0112",
  DB: "mydatabase",
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};
