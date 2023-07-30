const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const { errors } = require('celebrate');

// Слушаем 3000 порт
const { PORT = 3000 } = process.env;
const { routes } = require('./routes');
const errorHandler = require('./middlewares/errorhandler');

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(routes);

app.use(errors());
app.use(errorHandler);

const main = async () => {
  await mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  });
  app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
  });
};

main();
