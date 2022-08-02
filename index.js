const express = require('express');
const bodyParser = require('body-parser');
const talker = require('./talker.json');
const { readTalkers, generateToken } = require('./helpers');

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

// não remova esse endpoint, e para o avaliador funcionar /
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.get('/talker', async (req, res) => {
  const getTalkers = await readTalkers();
  if(!getTalkers) return res.status(200).json([]);
  res.status(200).json(getTalkers);
});

app.get('/talker/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const getTalkers = await readTalkers();

    const talkerById = getTalkers.find(({ id: talkerId }) => talkerId === Number(id));
    if(!talkerById) return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
    res.status(200).json(talkerById);
  } catch (error) {
    return res.status(500).end();
  }
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  res.status(200).json({ token: generateToken() });
});

app.listen(PORT, () => {
  console.log('Online');
});
