const fs = require('fs').promises;
const crypto = require('crypto');

const generateToken = () => crypto.randomBytes(8).toString('hex');

const readTalkers = async () => {
  const readTalkersFile = await fs.readFile('talker.json');
  const parseTalkers = JSON.parse(readTalkersFile);
  return parseTalkers;
};

module.exports = { readTalkers, generateToken };