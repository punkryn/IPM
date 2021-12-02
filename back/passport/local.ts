import passport from "passport";
// import { LocalStrategy } from "passport-local";
const { Strategy: LocalStrategy } = require("passport-local");
import bcrypt from "bcrypt";
import pool from "../pool";

export default () => {
  passport.use(
    "local",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      async (
        email: string,
        password: string,
        done: (...args: any[]) => void
      ) => {
        try {
          const user = await pool.query(
            `select * from users where email = "${email}"`
          );
          if (Array.isArray(user[0]) && !user[0].length) {
            return done(null, false, { reason: "존재하지 않는 이메일입니다!" });
          }

          if (Array.isArray(user[0])) {
            const value = user[0][0];
            if ("password" in value) {
              const result = await bcrypt.compare(password, value.password);
              if (result) {
                return done(null, user);
              }
            }
          }

          return done(null, false, { reason: "비밀번호가 틀렸습니다." });
        } catch (error) {
          console.error(error);
          return done(error);
        }
      }
    )
  );
};
