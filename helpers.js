const fs = require('fs').promises;

const readTalkers = async () => {
  const readTalkersFile = await fs.readFile('talker.json');
  const parseTalkers = JSON.parse(readTalkersFile);
  return parseTalkers;
};

module.exports = { readTalkers };