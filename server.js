// Inbuilt Node-Module
const crypto = require('crypto');
const path = require('path');
const { networkInterfaces } = require('os');

// Import Packages
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const cors = require('cors');

// Security
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');

// const asyncHandler = require('./middleware/async');

dotenv.config({ path: './config/config.env' });

const app = express();

// Load Models
const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');

// Body Parser
app.use(express.json());

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 150, // limit each IP to 100 requests per windowMs
});

// HTTP Parameter Pollution Attack
app.use(hpp());

//  apply to all requests
app.use(limiter);

// Helmet Middleware
app.use(helmet());

/* make sure this comes before any routes */
app.use(xss());

// Error Handler File
const errorHandler = require('./middleware/error');

// CORS
app.use(cors());

// Import DB File & Connect
const sequelize = require('./config/db');

// load routes
const product = require('./routes/product');
const users = require('./routes/user');
const order = require('./routes/order');

// Dev Logging Middleware
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// Mount Routes
app.use('/api/v1/products', product);
app.use('/api/v1/customers', users);
app.use('/api/v1/orders', order);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Association Relation
User.hasMany(Product, { foreignKey: { allowNull: false } });

Product.belongsTo(User, {
  foreignKey: { allowNull: false },
  constraints: true,
  onDelete: 'CASCADE',
});

User.hasMany(Order, { foreignKey: { allowNull: false } });
Product.hasMany(Order, { foreignKey: { allowNull: false } });

Order.belongsTo(User, {
  foreignKey: { allowNull: false },
  constraints: true,
  onDelete: 'CASCADE',
});
Order.belongsTo(Product, {
  foreignKey: { allowNull: false },
  constraints: true,
  onDelete: 'CASCADE',
});

let server;
// Sequelize Sync
sequelize
  // .sync({ force: true })
  .sync()
  .then((res) => {
    // console.log(res);

    server = app.listen(PORT, () =>
      console.log(
        `Server Started in Port ${process.env.PORT} on ${process.env.NODE_ENV} mode`
          .yellow.bold
      )
    );
  })
  .catch((err) => console.error(err));

// Handle Unhandled Rejection
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red.bold);
  // Close Server and Exit
  server.close(() => process.exit(1));
});

// Product.belongsTo(User, {constraints: true, onDelete: 'CASCADE})
// User.hasMany(Product)
