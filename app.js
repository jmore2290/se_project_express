require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const mainRouter = require("./routes/index");
const errorHandler = require("./middlewares/error-handler");
const {errors} = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');



const { PORT = 3001 } = process.env;
const app = express();


mongoose.connect('mongodb://127.0.0.1:27017/wtwr_db')
    .then(() =>{
        console.log("connected to DB");
    })
    .catch(console.error);

app.use(requestLogger);    
app.use(cors());
app.use(express.json());

/*
app.use((req, res, next) => {
        req.user = {
          _id: '66b562278bf15695cdd217fd'// paste the _id of the test user created in the previous step
        };
        next();
      });
      */

app.get('/crash-test', () => {
  setTimeout(() => {
      throw new Error('Server will crash now');
    }, 0);
  });

app.use("/", mainRouter);

app.use(errorLogger);

app.use(errors());
app.use(errorHandler);



app.listen(PORT, () =>{
   console.log(`Server is listening on port ${PORT}`);
});