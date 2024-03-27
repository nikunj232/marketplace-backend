const passport = require("passport");
const httpStatus = require("http-status");
const jwt = require("jsonwebtoken");
const ApiError = require("../utils/ApiError");

const verifyCallback =
  (req, resolve, reject, requiredRights) => async (err, user, info) => {
    if (err || info || !user) {
      return reject(
        new ApiError(httpStatus.UNAUTHORIZED, "You are not authorized", req)
      );
    }

    req.user = user;
    resolve();
  };


exports.auth =
  (...requiredRights) =>
    async (req, res, next) => {
      return new Promise((resolve, reject) => {
        passport.authenticate(
          "jwt",
          { session: false },
          verifyCallback(req, resolve, reject, requiredRights)
        )(req, res, next);
      })
        .then(() => next())
        .catch((err) => next(err));
    };

// check token if not then don't decode - give access to get
exports.authorizeV3 = () => async (req, res, next) => {
  const token = req.headers.authorization;
  if (token) {
    return new Promise((resolve, reject) => {
      passport.authenticate("jwt", { session: false })(req, res, next);
    })
      .then(() => next())
      .catch((err) => next(err));
  }
  next();
};