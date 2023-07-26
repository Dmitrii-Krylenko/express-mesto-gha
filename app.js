const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const { errors } = require('celebrate');

// Слушаем 3000 порт
const { PORT = 3000 } = process.env;
const { routes } = require('./routes');

const app = express();

app.use(cookieParser());
app.use(express.json());
// app.use((req, res, next) => {
//   req.user = {
//     _id: '64b117e650cbdd00d3303ac2',
//   };

//   next();
// });
app.use(routes);

// app.use('*', (req, res) => { res.status(404).json({ message: 'Страница не найдена' }); });
app.use(errors());
// app.use((err, req, res, next) => {
//   if (err.name === 'Error') {
//     res.status(400).send({ message: 'FJalgdlsnbfdlkaniare' });
//     return;
//   }
//   const { statusCode = 500, message = 'Ошибка сервера' } = err;
//   res.status(statusCode).send({ message });
//   next();
// });

// app.use((err, req, res, next) => {
//   const { statusCode = 500, message = 'Ошибка сервера' } = err;
//   res.status(statusCode).send({ message });
//   next();
// });

const main = async () => {
  await mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  });
  app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
  });
};

main();
