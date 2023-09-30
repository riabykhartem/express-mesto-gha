const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const routes = require('./routes/index');

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://127.0.0.1:27017/mydb', {
  useNewUrlParser: true,
});
const app = express();
app.use(bodyParser.json());

app.use((req, res, next) => {
  req.user = {
    _id: '65187f6a91a4752444507056',
  };

  next();
});

app.use(routes);

app.use((err, req, res, next) => {
  // если у ошибки нет статуса, выставляем 500
  const { statusCode = 500, message } = err;

   return res
    .status(statusCode)
    .send({
      // проверяем статус и выставляем сообщение в зависимости от него
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
});

app.listen(PORT);
