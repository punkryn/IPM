import express from "express";
import morgan from "morgan";
import path from "path";
import dotenv from "dotenv";
import pool from "./pool";
import cors from "cors";
import apiRouter from "./routes/api";

dotenv.config();

const app: express.Express = express();

app.set("PORT", Number(process.env.PORT) | 3055);

const prod = process.env.NODE_ENV === "production";

if (prod) {
  app.enable("trust proxy");
  app.use(morgan("combined"));
  // app.use(helmet({ contentSecurityPolicy: false }));
  // app.use(hpp());
} else {
  app.use(morgan("dev"));
  app.use(
    cors({
      origin: true,
      credentials: true,
    })
  );
}

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

app.use("/api", apiRouter);

// * 404 middleware
app.use((req, res, next) => {
  console.log("this is error middleware");
  res.send({ error: "404 not found" });
});

app.listen(app.get("PORT"), async () => {
  console.log(`server is on... ${app.get("PORT")}`);
});
