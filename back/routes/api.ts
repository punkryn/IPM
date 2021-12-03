import express from "express";
import pool from "../pool";
import bcrpyt from "bcrypt";
import passport from "passport";
import { isLoggedIn, isNotLoggedIn } from "./middlewares";

const router = express.Router();

router.get("/users", (req, res, next) => {
  return res.json(req.user || false);
});

router.post("/users", isNotLoggedIn, async (req, res, next) => {
  const body = req.body;
  try {
    console.log(body);
    const response = await pool.query(
      `select * from users where email = '${body.email}'`
    );

    if (Array.isArray(response[0]) && response[0].length) {
      return res.status(403).send("이미 사용 중인 아이디입니다.");
    }

    const hashedPassword = await bcrpyt.hash(body.password, 12);
    const queryString = `insert into users(email, nickname, password) values("${body.email}", "${body.nickname}", "${hashedPassword}")`;
    const insertResponse = await pool.query(queryString);
    res.status(201).send("ok");
  } catch (err) {
    if (err instanceof Error) {
      console.log(err.message);
      next(err);
    }
  }
});

router.post("/users/login", isNotLoggedIn, (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      console.error(err);
      return next(err);
    }
    if (info) {
      return res.status(401).send(info.reason);
    }
    return req.login(user, async (loginErr) => {
      if (loginErr) {
        console.error(loginErr);
        return next(loginErr);
      }

      console.log("userid", user[0][0]);
      const response = await pool.query(
        `select id, nickname, email from users where id = "${user[0][0].id}"`
      );
      if (Array.isArray(response[0])) {
        return res.status(200).json(response[0][0]);
      }
    });
  })(req, res, next);
});

router.post("/users/logout", isLoggedIn, (req, res) => {
  req.logout();
  req.session.destroy(() => {
    res.send("logout ok");
  });
});

export default router;
