const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
const config = require("./config.js");
const { tokenTypes } = require("./tokens.js");
const { User } = require("../models/index.js");

const jwtOptions = {
  secretOrKey: config.jwt.secret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

const jwtVerify = async (payload, done) => {
  try {
    if (payload.type !== tokenTypes.ACCESS) {
      throw new Error("Invalid token type");
    }
    const user = await User.findByPk(payload.sub)
    .then(data => data.dataValues);

    if (!user) {
      return done(null, false);
    }
    done(null, user);
  } catch (error) {
    done(error, false);
  }
};
console.log(jwtOptions);

const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);

module.exports = {
  jwtStrategy,
};
