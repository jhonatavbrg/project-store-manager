const express = require('express');
const bodyParser = require('body-parser').json();

const app = express();
const PORT = 3000;

app.use(bodyParser);

app.get('/', (_request, response) => {
  response.send();
});

app.listen(PORT, () => {
  console.log(`running at the door ${PORT}`);
});
