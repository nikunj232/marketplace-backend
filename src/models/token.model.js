
// const { Sequelize, DataTypes } = require('sequelize');

// const {tokenTypes} = require('../config/tokens.js');
// const sequelize = require('../config/database.js');

// const Token = sequelize.define("tokens", {
// 	id: {
// 		type: DataTypes.INTEGER,
// 		autoIncrement: true,
// 		allowNull: false,
// 		primaryKey: true
// 	},
// 	token: {
// 		type: DataTypes.STRING,
// 		required: false,
// 		allowNull: false
// 	},
// 	type: {
// 		type: DataTypes.ENUM(tokenTypes.ACCESS,
// 		  tokenTypes.REFRESH,
// 		  tokenTypes.RESET_PASSWORD,
// 		  tokenTypes.VERIFY_EMAIL,
// 		  tokenTypes.VERIFY_OTP),
// 		// Using ENUM for token types
// 		allowNull: false
// 	},
// 	userId: {
// 		type:DataTypes.STRING,
// 		allowNull: false
// 	},
// 	expires: {
// 		type:DataTypes.DATE,
// 		allowNull: false
// 	},
// });

// module.exports = Token;