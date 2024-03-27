const bcrypt = require('bcryptjs');
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database.js');

const User = sequelize.define('users', {
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			allowNull: false,
			primaryKey: true
		},
		username: DataTypes.STRING,
		email: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: '',
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: '',
		},
		isEmailVerified: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
		}
  	},
	{
		indexes: [
			{
				unique: true,
				fields: ['email']
			}],
		toJSON: {
			// By default, exclude the password field from the JSON representation
			exclude: ['password']
		}
	});

module.exports = User;