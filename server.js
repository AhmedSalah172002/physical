const path = require('path');

express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');
const compression = require('compression');

dotenv.config({ path: 'config.env' });


const ApiError = require('./utils/apiError');
const globalError = require('./middlewares/errorMiddleware');
const dbConnection = require('./config/database');

// Routes
const userRoute = require('./routes/userRoute');
const authRoute = require('./routes/authRoute');
const sendRequestRoute = require('./routes/RequestsRoute');




// Connect with db
dbConnection();


// express app
const app = express();
app.use(express.static(path.join(__dirname, 'uploads')));




app.use(cors());
app.options('*', cors());

app.use(compression());


// Middlewares
app.use(express.json());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
  console.log(`mode: ${process.env.NODE_ENV}`);
}


// Mount Routes
app.use('/api/v1/users', userRoute);
app.use('/api/v1/auth', authRoute);
app.use('/api/v1', sendRequestRoute);



app.all('*', (req, res, next) => {
  next(new ApiError(`Can't find this route: ${req.originalUrl}`, 400));
});


// Global error handling middleware for express
app.use(globalError);

const PORT = process.env.PORT || 9000;

const server = app.listen(PORT, () => {
  console.log(`App running running on port ${PORT}`);
});


// Handle rejection outside express
process.on('unhandledRejection', (err) => {
  console.error(`UnhandledRejection Errors: ${err.name} | ${err.message}`);
  server.close(() => {
    console.error(`Shutting down....`);
    process.exit(1);
  });
});
