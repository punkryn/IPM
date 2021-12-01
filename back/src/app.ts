import * as express from "express";
import morgan from "morgan";
import { type } from "os";
import path from "path";
// import { sequelize } from "../models";
const { sequelize } = require("../models");

const app: express.Express = express();

app.set("PORT", Number(process.env.PORT) | 3055);

sequelize
  .sync({ force: false })
  .then(() => {
    console.log("db connected");
  })
  .catch((err: any) => {
    if (err instanceof Error) {
      console.log(err);
    }
  });

app.use(morgan("dev"));

//* json middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

// * loggin middleware
app.get("/", (req, res, next) => {
  console.log("this is index middleware");
  next();
});

//* ROUTER
app.get("/", (req, res) => {
  res.send("success");
});

// * 404 middleware
app.use((req, res, next) => {
  console.log("this is error middleware");
  res.send({ error: "404 not found" });
});

app.listen(app.get("PORT"), () => {
  console.log(`server is on... ${app.get("PORT")}`);
});
