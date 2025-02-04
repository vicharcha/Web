import { Database } from 'sqlite3';

const db = new Database('database.sqlite');

function dbConnect(): Promise<Database> {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run('CREATE TABLE IF NOT EXISTS messages (id INTEGER PRIMARY KEY, content TEXT, sender TEXT, timestamp TEXT)');
      resolve(db);
    });
  });
}

export default dbConnect;
