const fs = require('fs').promises;
const crypto = require('crypto');

const generateToken = () => crypto.randomBytes(8).toString('hex');

const readTalkers = async () => {
  const readTalkersFile = await fs.readFile('talker.json');
  const parseTalkers = JSON.parse(readTalkersFile);
  return parseTalkers;
};

const writeTalkers = async (newTalker) => {
  const getTalkers = await readTalkers();
  getTalkers.push(newTalker);
  const writeTalkersFile = await fs.writeFile('talker.json', JSON.stringify(getTalkers, null, 2));
  return writeTalkersFile;
};

module.exports = { readTalkers, generateToken, writeTalkers };  