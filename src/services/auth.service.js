const httpStatus = require("http-status");
const bcrypt = require("bcryptjs");
const tokenService = require("./token.service");
const userService = require("./user.service");
// const Token = require("../models/token.model");
const ApiError = require("../utils/ApiError");
const { tokenTypes } = require("../config/tokens");
const { User, Cart } = require("../models/index.js");
const { ROLES, AGENT } = require("../utils/constant.helper");

/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<User>}
 */
const loginUserWithEmailAndPassword = async (email, password, req) => {
  const user = await User.findOne({where: {email} });

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "Email is Incorrect!", req);
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    throw new ApiError(httpStatus[401], "Invalid credential!", req);
    return;
  }

  return user
};

/**
 * Logout
 * @param {string} userId
 * @returns {Promise}
 */
// const logout = async (userId) => {
//   const destroyedToken = await refreshTokenDoc.destroy({
//     where:{
//       userId,
//       type: tokenTypes.REFRESH,
//       blacklisted: false,
//     }
//   });
//   return destroyedToken
// };

/**
 * Refresh auth tokens
 * @param {string} refreshToken
 * @returns {Promise<Object>}
 */
const refreshAuth = async (refreshToken) => {
  try {
    const refreshTokenDoc = await tokenService.verifyToken(
      refreshToken,
      tokenTypes.REFRESH
    );
    const user = await userService.getUserById(refreshTokenDoc.user);
    if (!user) {
      throw new Error();
    }
    await refreshTokenDoc.remove();
    return tokenService.generateAuthTokens(user);
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Please authenticate");
  }
};

/**
 * Reset password
 * @param {string} resetPasswordToken
 * @param {string} newPassword
 * @returns {Promise}
 */
const resetPassword = async (user, password, req) => {
  const matchpassword = await bcrypt.compare(password.password, user.password);
  if (matchpassword == true) {
    if (password.newPassword === password.confirmPassword) {
      const bcryptPass = await bcrypt.hash(password.newPassword, 8);
      const reserpass = await User.findOneAndUpdate(
        { _id: user._id },
        {
          $set: {
            password: bcryptPass,
          },
        },
        { new: true }
      );
      return reserpass;
    }
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "both_password_not_match",
      req
    );
  } else {
    throw new ApiError(httpStatus.NOT_FOUND, "old_password_wrong", req);
  }
};

/**
 * Verify email
 * @param {string} verifyEmailToken
 * @returns {Promise}
 */
const verifyEmail = async (verifyEmailToken) => {
  try {
    const verifyEmailTokenDoc = await tokenService.verifyToken(
      verifyEmailToken,
      tokenTypes.VERIFY_EMAIL
    );
    const user = await userService.getUserById(verifyEmailTokenDoc.user);
    if (!user) {
      throw new Error("User not found!");
    }
    // await Token.destroy({where:{ user: user.id, type: tokenTypes.VERIFY_EMAIL }});
    await userService.updateUserById(user.id, { isEmailVerified: true });
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Email verification failed");
  }
};


// generat password
const characters =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
function generatePassword(length) {
  let result = "";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}


/**
 * 
 * @param {*} user 
 * @returns 
 */
const accessToken = async (user) => {

  /** find user and return user data */
  const userDetail = await User.findOne({ where: { id: user.id }})
  const cartListCount = await Cart.count({ where: { userId: user.id }})
  const cartListItem = await Cart.findAll({ where: { userId: user.id }})
  const cartItems = await Cart.findAll({
    where: { userId: user?.id },
    attributes: ['productId'],
  });

  const productIdsInCart = cartItems.map((cartItem) => cartItem.productId);
  return data = {user:userDetail, cartItem: productIdsInCart, cartListCount}
}


module.exports = {
  loginUserWithEmailAndPassword,
  // logout,
  refreshAuth,
  resetPassword,
  verifyEmail,
  accessToken
};