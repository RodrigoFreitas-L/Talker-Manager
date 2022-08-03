const express = require('express');
const bodyParser = require('body-parser');
const talker = require('./talker.json');
const { readTalkers, generateToken, writeTalkers, modifyTalker } = require('./helpers');
const { verifyName } = require('./middlewares/verifyName');
const { verifyAge } = require('./middlewares/verifyAge');
const { verifyTalk } = require('./middlewares/verifyTalk');
const { verifyWatchedAt } = require('./middlewares/verifyWatchedAt');
const { verifyRate } = require('./middlewares/verifyRate');
const { verifyToken } = require('./middlewares/verifyToken');
const fs = require('fs').promises;

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
  const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

  if(!email) return res.status(400).json({ message: "O campo \"email\" é obrigatório" });

  if(!regex.test(email)) return res.status(400).json({ message: "O \"email\" deve ter o formato \"email@email.com\"" });

  if(!password) return res.status(400).json({ message: "O campo \"password\" é obrigatório" });

  if(password.length < 6) return res.status(400).json({ message: "O \"password\" deve ter pelo menos 6 caracteres"});

  res.status(200).json({ token: generateToken() });
});

app.post('/talker', verifyToken, verifyName, verifyAge, verifyTalk, verifyWatchedAt, verifyRate, async (req, res) => {
  const { name, age, talk: { watchedAt, rate } } = req.body;
  const getTalkers = await readTalkers();
  const id = getTalkers.length + 1;
  await writeTalkers({ name, age, id, talk: { watchedAt, rate } });
  return res.status(201).json({ name, age, id, talk: { watchedAt, rate } });
});

app.put('/talker/:id',verifyToken, verifyName, verifyAge, verifyTalk, verifyWatchedAt, verifyRate, async (req, res) => {
  const { id } = req.params;
  const idToNumber = Number(id);
  const { name, age, talk: { watchedAt, rate } } = req.body;
  const getTalkers = await readTalkers();
  const talkerById = getTalkers.findIndex((talker) => talker.id === Number(id));
  const newTalker = [...getTalkers];
  newTalker[talkerById] = { name, age, id: idToNumber, talk: { watchedAt, rate } };
  await fs.writeFile('talker.json', JSON.stringify(newTalker));
  return res.status(200).json({ name, age, id: idToNumber, talk: { watchedAt, rate } });
});

app.listen(PORT, () => {
  console.log('Online');
});
