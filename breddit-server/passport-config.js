const passport = require("passport");
const passportJWT = require("passport-jwt");
const bcrypt = require("bcrypt");

const ExtractJWT = passportJWT.ExtractJwt;

const LocalStrategy = require("passport-local").Strategy;
const JWTStrategy = passportJWT.Strategy;

const { getUserByUsername, getUserById } = require("./api/user-api");

const authenticateUser = async (username, password, done) => {
  const user = await getUserByUsername(username);
  if (user === null)
    return done(null, false, { message: "Wrong credentials", status: 401 });

  try {
    if (await bcrypt.compare(password, user.password)) {
      delete user.password;
      delete user.activation_guid;
      delete user.activation_expire_date;
      return done(null, user);
    } else
      return done(null, false, { message: "Wrong credentials", status: 401 });
  } catch (e) {
    return done(e);
  }
};

passport.use(
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password",
    },
    authenticateUser
  )
);

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.SECRET,
    },
    async function (jwtPayload, cb) {
      return await getUserById(jwtPayload.id)
        .then((user) => {
          return cb(null, user);
        })
        .catch((err) => {
          return cb(err);
        });
    }
  )
);
