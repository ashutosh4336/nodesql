const Sequelize = require('sequelize');

const sequelize = require('../config/db');

const User = sequelize.define(
  'users',
  {
    id: {
      type: Sequelize.INTEGER,
      // type: Sequelize.UUID,
      // defaultValue: DataTypes.UUIDV4,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    username: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: {
        args: true,
        msg: 'Username already in use!',
      },
      validate: {
        isAlphanumeric: true,
      },
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: {
        args: true,
        msg: 'Email address already in use!',
      },
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        len: [6, 255],
      },
    },

    isDeleted: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },

    role: {
      type: Sequelize.ENUM,
      values: ['user', 'admin'],
      defaultValue: 'user',
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
  },
  {
    scopes: {
      withoutPassword: {
        attributes: { exclude: ['password'] },
      },
    },

    classMethods: {},
  }
);

// HashPassword
// hashPassword = async function (password) {
//   const salt = await bcrypt.genSalt(10);
//   return (user.password = await bcrypt.hash(password, salt));
// };

module.exports = User;
