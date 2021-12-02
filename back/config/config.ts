import dotenv from "dotenv";
dotenv.config();

export const config = {
  development: {
    username: process.env.DB_USERNAME || "root",
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DBNAME || "ipm",
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 3308,
    dialect: "mysql",
  },
};
