const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const routes = require('./routes/index');

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://127.0.0.1:27017/mydb', {
  useNewUrlParser: true,
}).then(console.log('БД подключена'));
const app = express();
app.use(bodyParser.json());

app.use((req, res, next) => {
  req.user = {
    _id: '64ffd7fa4d3cab4ba3496eaf',
  };

  next();
});

app.use(routes);

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
