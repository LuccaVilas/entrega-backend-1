import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { Strategy as LocalStrategy } from "passport-local";

import { userRepository } from "../repositories/user.repository.js";
import { isValidPassword } from "../utils/password.js";

export const initializePassport = () => {
  passport.use(
    "login",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        session: false
      },
      async (email, password, done) => {
        try {
          const user = await userRepository.getUserByEmail(email);

          if (!user) {
            return done(null, false, {
              message: "Usuario o contraseña incorrectos"
            });
          }

          const validPassword = isValidPassword(user, password);

          if (!validPassword) {
            return done(null, false, {
              message: "Usuario o contraseña incorrectos"
            });
          }

          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use(
    "current",
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET
      },
      async (jwtPayload, done) => {
        try {
          const user = await userRepository.getUserById(jwtPayload.id);

          if (!user) {
            return done(null, false);
          }

          return done(null, user);
        } catch (error) {
          return done(error, false);
        }
      }
    )
  );
};