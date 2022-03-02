import Fson from 'fson-db';

const db = Fson('.db');

//init default
const defDB = {
  users: [],
}

for (let key in defDB) {
  if (!db[key]) db[key] = defDB[key];
}

export default db
