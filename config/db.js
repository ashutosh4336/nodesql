const Sequelize = require('sequelize');

const sequelize = new Sequelize(
  process.env.MYSQL_DBNAME,
  process.env.MYSQL_USER,
  process.env.MYSQL_PASSWORD,
  {
    dialect: 'mysql',
    host: process.env.MYSQL_HOST,
    charset: 'utf8',
    query: {
      raw: true,
    },
    logging: false,
    dialectOptions: {
      dateStrings: true,
      typeCast: true,
    },
    timezone: '+05:30', //for writing to database
  },
  console.log(`DB Connected on ${process.env.MYSQL_HOST}`.cyan.bold.underline)
);

module.exports = sequelize;

/*
const mysql = require("mysql2");
const { promisify } = require("util");

let database = {};
if (process.env.NODE_ENV == "development") {
  database = {
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
  };
} else if (process.env.NODE_ENV == "production") {
  database = {
    socketPath: process.env.DATABASE_SOCKET_PATH,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
  };
} else {
  database = {
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
  };
}



const pool = mysql.createPool(database);
pool.getConnection((err, connection) => {
  if (err) {
    if (err.code === "PROTOCOL_CONNECTION_LOST") {
      console.error("Database connection was closed.");
    }
    if (err.code === "ER_CON_COUNT_ERROR") {
      console.error("Database has to many connections");
    }
    if (err.code === "ECONNREFUSED") {
      console.error("Database connection was refused");
    }
  }

  if (connection) connection.release();
  console.log("DB is Connected");
  return;
});

pool.query = promisify(pool.query);

module.exports = pool;

*/
