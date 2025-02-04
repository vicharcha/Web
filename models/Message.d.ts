declare module 'models/Message' {
  import { Database } from 'sqlite3';

  interface Message {
    id: number;
    content: string;
    sender: string;
    timestamp: string;
  }

  class MessageModel {
    constructor(db: Database);
    createMessage(content: string, sender: string, timestamp: string): Promise<Message>;
    getMessages(): Promise<Message[]>;
  }

  export default MessageModel;
}
