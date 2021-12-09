import express, { query } from "express";
import pool from "../pool";
import bcrpyt from "bcrypt";
import passport from "passport";
import { isLoggedIn, isNotLoggedIn } from "./middlewares";

const router = express.Router();

router.delete("/tab/:id", isLoggedIn, async (req, res, next) => {
  const param = req.params;
  try {
    const queryString = `delete from tab where id = ${param.id}`;
    await pool.query(queryString);
    res.send("ok");
  } catch (err) {
    console.log(err);
    next(err);
  }
});

router.post("/tab", isLoggedIn, async (req, res, next) => {
  const body = req.body;
  try {
    console.log(body);
    const queryString = `insert into tab(name, user_row_id_from_tab) values("새 탭", ${body.id})`;
    await pool.query(queryString);
    res.status(201).send("ok");
  } catch (err) {
    console.log(err);
    next(err);
  }
});

router.get("/tab/:nickname", isLoggedIn, async (req, res, next) => {
  try {
    const param = req.params;
    // console.log(param);
    const queryString = `select information.id as info_id, tab.id as tab_id, tab.name as tab_name, information.userEmail, information.hint, information.host from users join tab on users.id = tab.user_row_id_from_tab join information on tab.id = information.tab_row_id where users.nickname = '${param.nickname}'`;
    const response = await pool.query(queryString);
    // console.log(response);
    if (Array.isArray(response[0])) {
      // console.log(response[0]);
      res.status(200).json(response[0]);
    }
  } catch (err: any) {
    console.log(err.message);
    next(err);
  }
});

router.post("/tab/:tab", isLoggedIn, async (req, res, next) => {
  const params = req.params;
  const body = req.body;
  try {
    const queryString = `insert into information(userEmail, userPassword, hint, host, tab_row_id) values('${body.id}', '${body.pwd}', '${body.hint}', '${body.host}', ${params.tab})`;
    await pool.query(queryString);
    res.send("ok");
  } catch (err) {
    console.log(err);
    next(err);
  }
});

router.delete("/tab/info/:id", isLoggedIn, async (req, res, next) => {
  const params = req.params;
  try {
    const queryString = `delete from information where id = ${params.id}`;
    await pool.query(queryString);
    res.send("ok");
  } catch (err) {
    console.log(err);
    next(err);
  }
});

router.get("/users", (req, res, next) => {
  // console.log(req.user);
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
    console.log(insertResponse);

    if ("insertId" in insertResponse[0]) {
      const createInitialTabQuery = `insert into tab(name, user_row_id_from_tab) values("새 탭", "${insertResponse[0].insertId}")`;
      await pool.query(createInitialTabQuery);
    }

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
