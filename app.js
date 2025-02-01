const express = require('express');
const userRouter = require('./routes/userRoutes');
const appRouter = require('./routes/appRoutes');
const viewRouter = require('./routes/viewRoutes');
const cookieParser = require('cookie-parser');
const path = require('path');
const cors = require('cors');
const app = express();

// Enable CORS for frontend
const allowedOrigins = ['https://gcit-hub-mkrr.onrender.com'];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Allow credentials for cookies
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

app.use(cookieParser());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'views')));
app.use('/images', express.static(path.join(__dirname, 'views/img')));
app.use('/components', express.static(path.join(__dirname, 'views/components')));
app.use('/js', express.static(path.join(__dirname, 'views/js')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/v1/users', userRouter);
app.use('/api/v1/apps', appRouter);
app.use('/', viewRouter);

// Global Error Handler
app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    error: err.message
  });
});

module.exports = app;
