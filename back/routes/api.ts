import express, { query } from "express";
import pool from "../pool";
import bcrpyt from "bcrypt";
import passport from "passport";
import { createCipheriv, createDecipheriv, randomBytes } from "crypto";
import { isLoggedIn, isNotLoggedIn } from "./middlewares";

const router = express.Router();
const nonce = randomBytes(12);

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
    // console.log(body);
    const queryString = `insert into tab(name, user_row_id_from_tab) values("새 탭", ${body.id})`;
    await pool.query(queryString);
    res.status(201).send("ok");
  } catch (err) {
    console.log(err);
    next(err);
  }
});

router.get("/tab/info/:nickname", isLoggedIn, async (req, res, next) => {
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

router.get("/tabs/info/:nickname", isLoggedIn, async (req, res, next) => {
  try {
    const param = req.params;
    // console.log(param);
    const queryString = `select tab.id as tab_id, tab.name as tab_name from users join tab on users.id = tab.user_row_id_from_tab where users.nickname = '${param.nickname}'`;
    const response = await pool.query(queryString);
    if (Array.isArray(response[0])) {
      res.status(200).json(response[0]);
    }
  } catch (err: any) {
    console.log(err.message);
    next(err);
  }
});

router.get("/tab/:nickname", isLoggedIn, async (req, res, next) => {
  try {
    const params = req.params;
    const queryString = `select min(tab.id) as minId from users join tab on users.id = tab.user_row_id_from_tab where users.nickname = '${params.nickname}'`;
    const response = await pool.query(queryString);
    // console.log(response[0]);
    res.json(response[0]);
  } catch (err) {
    console.log(err);
    next(err);
  }
});

router.post("/tab/:tab", isLoggedIn, async (req, res, next) => {
  const params = req.params;
  const body = req.body;
  try {
    if (process.env.AES_KEY !== undefined && process.env.AAD !== undefined) {
      const aad = Buffer.from(process.env.AAD, "hex");
      const cipher = createCipheriv("aes-192-ccm", process.env.AES_KEY, nonce, {
        authTagLength: 16,
      });

      cipher.setAAD(aad, {
        plaintextLength: Buffer.byteLength(body.pwd),
      });

      const ciphertext = cipher.update(body.pwd, "utf8");
      cipher.final();
      const tag = cipher.getAuthTag();

      const queryString = `insert into information(userEmail, userPassword, hint, host, tab_row_id, tag, ran) values('${
        body.id
      }', '${ciphertext.toString("hex")}', '${body.hint}', '${body.host}', ${
        params.tab
      }, '${tag.toString("hex")}', '${nonce.toString("hex")}')`;
      await pool.query(queryString);

      return res.send("ok");
    }
    throw new Error("unknown");
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

router.patch("/tab/:id", isLoggedIn, async (req, res, next) => {
  const params = req.params;
  const body = req.body;
  try {
    const queryString = `update tab set name = '${body.name}' where id = ${params.id}`;
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
    // console.log(body);
    const response = await pool.query(
      `select * from users where email = '${body.email}'`
    );

    if (Array.isArray(response[0]) && response[0].length) {
      return res.status(403).send("이미 사용 중인 아이디입니다.");
    }

    const hashedPassword = await bcrpyt.hash(body.password, 12);
    const queryString = `insert into users(email, nickname, password) values("${body.email}", "${body.nickname}", "${hashedPassword}")`;
    const insertResponse = await pool.query(queryString);
    // console.log(insertResponse);

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

router.post("/users/:nickname/password", isLoggedIn, async (req, res, next) => {
  const body = req.body;
  const params = req.params;
  try {
    const queryString = `select password from users where nickname = '${params.nickname}'`;
    const response = await pool.query(queryString);

    if (Array.isArray(response[0]) && "password" in response[0][0]) {
      const result = await bcrpyt.compare(
        body.password,
        response[0][0].password
      );
      if (result) {
        // const qs = `select users.nickname, information.userEmail, information.userPassword from users join tab on users.id = tab.user_row_id_from_tab join information on tab.id = information.tab_row_id where users.nickname = '${params.nickname}' and tab.id = ${body.tabIndex};`;
        const qs = `select userPassword, tag, ran from information where id = ${body.currentPwd}`;
        const response2 = await pool.query(qs);
        if (
          process.env.AES_KEY !== undefined &&
          process.env.AAD !== undefined
        ) {
          if (
            Array.isArray(response2[0]) &&
            "userPassword" in response2[0][0] &&
            "tag" in response2[0][0]
          ) {
            const aad = Buffer.from(process.env.AAD, "hex");
            const tag = Buffer.from(response2[0][0].tag, "hex");
            const ciphertext = Buffer.from(response2[0][0].userPassword, "hex");

            const decipher = createDecipheriv(
              "aes-192-ccm",
              process.env.AES_KEY,
              Buffer.from(response2[0][0].ran, "hex"),
              {
                authTagLength: 16,
              }
            );
            decipher.setAuthTag(tag);
            decipher.setAAD(aad, {
              plaintextLength: ciphertext.length,
            });
            const receivedPlaintext = decipher.update(
              ciphertext,
              undefined,
              "utf8"
            );

            try {
              decipher.final();
            } catch (err) {
              console.log("authentication failed", { cause: err });
              next(err);
            }
            res.send(receivedPlaintext);
          }
        }
      } else {
        res.status(401).send("암호가 일치하지 않습니다");
      }
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
});

// router.post("/tmp", async (req, res, next) => {
//   const qs2 = `select * from information`;
//   const result = await pool.query(qs2);
//   if (Array.isArray(result[0])) {
//     result[0].forEach(async (item) => {
//       if (
//         process.env.AES_KEY !== undefined &&
//         process.env.AAD !== undefined &&
//         "userPassword" in item
//       ) {
//         console.log("key", process.env.AES_KEY, process.env.AAD);
//         const qs = `update information set ran ='${nonce.toString(
//           "hex"
//         )}' where id = ${item.id}`;
//         await pool.query(qs);
//       }
//     });
//     return res.send("ok");
//   }
// });

export default router;
