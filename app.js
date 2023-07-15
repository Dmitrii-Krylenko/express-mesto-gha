const express = require('express');
const mongoose = require('mongoose');
// Слушаем 3000 порт
const { PORT = 3000 } = process.env;
const { routes } = require('./routes');

const app = express();

app.use(express.json());
app.use((req, res, next) => {
  req.user = {
    _id: '64b117e650cbdd00d3303ac2', // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});
app.use(routes);
// app.use('/users', require('./routes/users'));
// app.use('/cards', require('./routes/cards'));

const main = async () => {
  await mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
    // useNewUrlParser: true,
    // useCreateIndex: true,
    // useFindAndModify: false,
  });

  // mongoose.set()

  app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
  });
};

main();
