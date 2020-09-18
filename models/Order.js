const Sequelize = require('sequelize');
const sequelize = require('../config/db');

const Cart = sequelize.define('orders', {
  id: {
    type: Sequelize.INTEGER,
    // type: Sequelize.UUID,
    // defaultValue: DataTypes.UUIDV4,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  cancelled: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
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

module.exports = Cart;
