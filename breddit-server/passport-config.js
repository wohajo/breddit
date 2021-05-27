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
    if (await bcrypt.compare(password, user.password))
      return done(null, { id: user.id, username: user.username, status: 200 });
    else
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
      secretOrKey: "your_jwt_secret",
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
