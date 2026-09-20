import express from 'express';
import cors from 'cors';

const app = express();
const port = process.env.PORT;
const games = [];

app.use(cors());
app.use(express.json({ limit: '10kb' }));

app.get('/boards', (req, res) => {
  res.json(games);
});

app.post('/boards', (req, res) => {
  if (Array.isArray(req.body) && req.body.length === 9) {
    games.push(req.body);
    res.json({ message: 'Game Saved' });
    return;
  }

  res.status(400).json({ message: 'Invalid board' });
});

app.listen(port, () => {
  console.log(`Listening on port: ${port}`);
});
