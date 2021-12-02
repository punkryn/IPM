import express from "express";
import pool from "../pool";
import bcrpyt from "bcrypt";
import { nextTick } from "process";

const router = express.Router();

router.post("/users", async (req, res, next) => {
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

export default router;
