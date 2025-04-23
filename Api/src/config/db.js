require("dotenv").config();
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize({
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: "mysql",
  dialectOptions: {
    ssl: process.env.DB_SSL === "true" ? { require: true, rejectUnauthorized: false } : false,
  },
});

sequelize
  .authenticate()
  .then(() => console.log("✅ Conectado correctamente a la base de datos"))
  .catch((err) => console.error("❌ Error al conectar a la base de datos:", err));

module.exports = sequelize;
