const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const app = express();
const cors = require('cors');
const Http = require('http');
const mongoose = require('mongoose');
const http = Http.createServer(app);

const { usersRouter, chatsRouter } = require('./routes');
const io = require('./socket');

const requestMiddleware = ((req, res, next) => {
    console.log("Request URL:", req.originalUrl, "-", new Date());
    next();
  });

  const server = async () => {
    try {
      if (process.env.NODE_ENV !== 'test') {
        await mongoose.connect(process.env.NODE_MONGOOSE, { ignoreUndefined: true });
      }
  
      app.use(express.json());
      app.use(express.urlencoded({ extended: false }));
      app.use(cors());
      app.use(requestMiddleware);
  
      app.use("/api", [usersRouter, chatsRouter]);
      
      app.get('/', function (req, res) {
        res.send('연결완료');
      })
  
    } catch (err) {
      console.log(err);
    }
  }
  
  server();
  io(http);
  
  
  // app.listen(process.env.PORT, () => {
  //   console.log('port에 연결 완료')
  // });
  
  module.exports = http;