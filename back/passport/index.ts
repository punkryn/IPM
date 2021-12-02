import passport from "passport";
import pool from "../pool";
import local from "./local";

export default () => {
  passport.serializeUser((user, done) => {
    // 서버쪽에 [{ id: 1, cookie: 'clhxy' }]
    if (Array.isArray(user)) {
      if (Array.isArray(user[0])) {
        if ("id" in user[0][0]) {
          done(null, user[0][0].id);
        }
      }
    }
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await pool.query(
        `select id, nickname, email from users where id = "${id}"`
      );

      if (Array.isArray(user[0]) && !user[0].length) {
        return done(new Error("no user"));
      }

      return done(null, user); // req.user
    } catch (error) {
      console.error(error);
      return done(error);
    }
  });

  local();
};
