import express from "express";
import morgan from "morgan";
import path from "path";
import dotenv from "dotenv";
import mysql from "mysql2/promise";

dotenv.config();

const app: express.Express = express();

app.set("PORT", Number(process.env.PORT) | 3055);

app.use(morgan("dev"));

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DBNAME,
  connectionLimit: 10,
});

//* json middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

// * loggin middleware
app.get("/", (req, res, next) => {
  console.log("this is index middleware");
  next();
});

//* ROUTER
app.get("/", async (req, res) => {
  try {
    const data = await pool.query("select * from users");
    res.json(data[0]);
  } catch (err) {
    res.status(500).json(err);
  }
});

// * 404 middleware
app.use((req, res, next) => {
  console.log("this is error middleware");
  res.send({ error: "404 not found" });
});

app.listen(app.get("PORT"), async () => {
  console.log(`server is on... ${app.get("PORT")}`);
});
