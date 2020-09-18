const Sequelize = require('sequelize');

const sequelize = require('../config/db');

const Product = sequelize.define('products', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  title: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  price: {
    type: Sequelize.DECIMAL,
    allowNull: false,
  },
  description: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
  image_url: {
    type: Sequelize.STRING,
  },
  purchase_count: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
  },

  createdAt: {
    type: 'TIMESTAMP',
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    allowNull: false,
  },
  updatedAt: {
    type: 'TIMESTAMP',
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    allowNull: false,
  },
});

module.exports = Product;

/*
const db = require('../config/db');

module.exports = class Product {
  constructor(id, title, price, description, imageUrl) {
    this.id = id;
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
  }

  static fetchAll() {
    const sqlQuery = `SELECT * FROM products`;
    return db.execute(sqlQuery);
  }

  addProduct() {
    const sqlQuery = `INSERT INTO products(title, price,description, image_url) VALUES(?, ?, ?, ?)`;
    return db.execute(sqlQuery, [
      this.title,
      this.price,
      this.description,
      this.imageUrl,
    ]);
  }

  static fetchSingleProduct(id) {
    // console.log(id);
    const sqlQuery = `SELECT * FROM products WHERE prdduct_id=?`;
    return db.execute(sqlQuery, [id]);
  }
};
*/
