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
  const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

  if(!email) return res.status(400).json({ message: "O campo \"email\" é obrigatório" });

  if(!regex.test(email)) return res.status(400).json({ message: "O \"email\" deve ter o formato \"email@email.com\"" });

  if(!password) return res.status(400).json({ message: "O campo \"password\" é obrigatório" });

  if(password.length < 6) return res.status(400).json({ message: "O \"password\" deve ter pelo menos 6 caracteres"});

  res.status(200).json({ token: generateToken() });
});

app.listen(PORT, () => {
  console.log('Online');
});
