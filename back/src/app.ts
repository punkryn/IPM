import * as express from "express";

const app: express.Express = express();

app.set("PORT", Number(process.env.PORT) | 3055);

app.use((req, res, next) => {
  console.log(req.rawHeaders[1]);
  console.log("this is logging middleware");
  next();
});

//* json middleware
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
