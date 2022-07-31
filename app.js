const express = require('express');
const cors = require('cors');

const app = express();
const port = 8000;
const morgan = require('morgan');
const commentRouter = require('./src/routes/comments.routes');
const ratingRouter = require('./src/routes/ratings.routes');
const websiteEntityRouter = require('./src/routes/website.routes');
const hookmarkRouter = require('./src/routes/hookmark.routes');

app.use(cors());

app.use(morgan('tiny'));
app.use(express.json());
app.use('/comment', commentRouter);
app.use('/rating', ratingRouter);
app.use('/website', websiteEntityRouter);
app.use('/hookmark', hookmarkRouter);

app.get('/', async (req, res) => {
  res.status(200).json({ msg: 'Hello' });
});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
