import { Sequelize } from "sequelize";
import { config } from "../config/config";

// const env = process.env.NODE_ENV || "development";
// const config = require("../config/config")[env];

// console.log(
//   config.development.password,
//   config.development.username,
//   config.development.port,
//   config.development.host,
//   config.development.database
// );
export const sequelize = new Sequelize(
  config.development.database,
  config.development.username,
  config.development.password,
  {
    host: config.development.host,
    dialect: "mysql",
    port: 3308,
  }
  // config.database,
  // config.username,
  // config.password,
  // config
);

// const db = {
//   sequelize,
// };
// export default db;
