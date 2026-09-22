import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { User } from "../models/user.model.js";

const cookieExtractor = (req) => {
  let token = null;

  if (req && req.headers.authorization) {
    const authHeader = req.headers.authorization;

    if (authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }
  }

  return token;
};

export const initializePassport = () => {
  passport.use(
    "current",
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
        secretOrKey: process.env.JWT_SECRET
      },
      async (jwt_payload, done) => {
        try {
          const user = await User.findById(jwt_payload.id).select("-password");

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