import { Database } from 'sqlite3';
import dbConnect, { closeDbConnection } from '../lib/db';
import MessageModel from '../models/Message';

describe('SQLite3 Database Tests', () => {
  let db: Database;

  beforeAll(async () => {
    db = await dbConnect();
  });

  afterAll(async () => {
    await closeDbConnection();
  });

  test('dbConnect should establish a database connection', async () => {
    expect(db).toBeDefined();
  });

  test('closeDbConnection should close the database connection', async () => {
    await closeDbConnection();
    expect(db.open).toBe(false);
  });

  test('createMessage should insert a new message into the database', async () => {
    const messageModel = new MessageModel(db);
    const message = await messageModel.createMessage('Hello, world!', 'User1', new Date().toISOString());
    expect(message).toHaveProperty('id');
    expect(message.content).toBe('Hello, world!');
    expect(message.sender).toBe('User1');
  });

  test('getMessages should retrieve all messages from the database', async () => {
    const messageModel = new MessageModel(db);
    const messages = await messageModel.getMessages();
    expect(messages.length).toBeGreaterThan(0);
  });

  test('deleteMessage should remove a message from the database', async () => {
    const messageModel = new MessageModel(db);
    const message = await messageModel.createMessage('Message to delete', 'User2', new Date().toISOString());
    await messageModel.deleteMessage(message.id);
    const messages = await messageModel.getMessages();
    expect(messages.find((msg) => msg.id === message.id)).toBeUndefined();
  });

  test('updateMessage should modify the content of a message in the database', async () => {
    const messageModel = new MessageModel(db);
    const message = await messageModel.createMessage('Message to update', 'User3', new Date().toISOString());
    await messageModel.updateMessage(message.id, 'Updated content');
    const updatedMessage = (await messageModel.getMessages()).find((msg) => msg.id === message.id);
    expect(updatedMessage.content).toBe('Updated content');
  });
});
