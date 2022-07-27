const express = require('express');
const cors = require('cors');

const app = express();
const port = 3000;
const morgan = require('morgan');

app.use(cors());

app.use(morgan('tiny'));
app.use(express.json());

app.get('/', async (req, res) => {
  res.status(200).json({ msg: 'Hello' });
});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
