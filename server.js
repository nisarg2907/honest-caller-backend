const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require('cors');

dotenv.config();
const { PrismaClient } = require("@prisma/client");
const appRoutes = require('./routes');

const corsOptions = {
    origin: 'http://frontend-url',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
};
const app = express();


app.use(express.json());
app.use(morgan('dev'));
app.use(cors(corsOptions));

const PORT = process.env.PORT || 3001;
const prisma = new PrismaClient();

// Connect to db
prisma.$connect()
  .then(() => {
    console.log('Connected to the database');
    
    // Entry point for all the routes
    app.use('/api', appRoutes);

    app.listen(PORT, () => {
      console.log("Server running on port " + PORT);
    });
  })
  .catch((error) => {
    console.error('Error connecting to the database:', error);
    process.exit(1); // Exiting the process 
  });
