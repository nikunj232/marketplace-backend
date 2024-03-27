const bcrypt = require('bcryptjs');
const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database.js');
const { User } = require('./index.js');

// class Product extends Model
const Product = sequelize.define('products', {
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			allowNull: false,
			primaryKey: true
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false
		},
		price: {
			type: DataTypes.FLOAT,
			allowNull:false
		},
		description: {
			type: DataTypes.STRING,
			allowNull: false
		},
		image: {
			type: DataTypes.STRING,
			allowNull: false
		},
		isSold: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
		}
  	}
);

User.hasMany(Product);
Product.belongsTo(User, { foreignKey: 'userId' });
// Product.associate = (models) => {
//     Product.belongsTo(models.User, { foreignKey: 'userId' });
// };

module.exports = Product;