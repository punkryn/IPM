import express from "express";
import morgan from "morgan";
import path from "path";
import dotenv from "dotenv";
import pool from "./pool";
import cors from "cors";
import apiRouter from "./routes/api";
import expressSession from "express-session";
import cookieParser from "cookie-parser";
import passport from "passport";
import passportConfig from "./passport";
import helmet from "helmet";
import hpp from "hpp";

dotenv.config();

const app: express.Express = express();

app.set("PORT", Number(process.env.PORT) | 3055);
passportConfig();

const prod = process.env.NODE_ENV === "production";

if (prod) {
  app.enable("trust proxy");
  app.use(morgan("combined"));
  app.use(helmet({ contentSecurityPolicy: false }));
  app.use(hpp());
} else {
  app.use(morgan("dev"));
  app.use(
    cors({
      origin: true,
      credentials: true,
    })
  );
  app.use(helmet({ contentSecurityPolicy: false }));
  app.use(hpp());
}

//* json middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
  expressSession({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET!,
    cookie: {
      httpOnly: true,
      secure: false, // https -> true
      // domain: prod ? ".ipm.com" : undefined,
    },
    name: "connect.sid",
  })
);
app.use(passport.initialize());
app.use(passport.session());

// * loggin middleware
app.get("/", (req, res, next) => {
  console.log("this is index middleware");
  next();
});

//* ROUTER
app.get("/", async (req, res) => {
  try {
    res.send("hello");
  } catch (err) {
    res.status(500).json(err);
  }
});

app.use("/api", apiRouter);

// * 404 middleware
app.use((req, res, next) => {
  console.log("this is error middleware");
  // res.send({ error: "404 not found" });
  let options = {
    root: path.join(__dirname, "public"),
    headers: {
      "x-timestamp": Date.now(),
      "x-sent": true,
    },
  };
  res.sendFile("index.html", options);
});

app.listen(app.get("PORT"), async () => {
  console.log(`server is on... ${app.get("PORT")}`);
});
