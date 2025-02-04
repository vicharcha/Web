import { Database } from 'sqlite3';

interface Message {
  id: number;
  content: string;
  sender: string;
  timestamp: string;
}

class MessageModel {
  private db: Database;

  constructor(db: Database) {
    this.db = db;
  }

  createMessage(content: string, sender: string, timestamp: string): Promise<Message> {
    return new Promise((resolve, reject) => {
      this.db.run(
        'INSERT INTO messages (content, sender, timestamp) VALUES (?, ?, ?)',
        [content, sender, timestamp],
        function (err) {
          if (err) {
            reject(err);
          } else {
            resolve({
              id: this.lastID,
              content,
              sender,
              timestamp,
            });
          }
        }
      );
    });
  }

  getMessages(): Promise<Message[]> {
    return new Promise((resolve, reject) => {
      this.db.all('SELECT * FROM messages', (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows as Message[]);
        }
      });
    });
  }
}

export default MessageModel;
