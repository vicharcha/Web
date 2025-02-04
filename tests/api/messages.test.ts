import request from 'supertest';
import { createServer } from 'http';
import { NextApiHandler } from 'next';
import { GET, POST, DELETE, PUT } from '../../app/api/messages/route';
import dbConnect, { closeDbConnection } from '../../lib/db';

const handler: NextApiHandler = async (req, res) => {
  if (req.method === 'GET') {
    return GET(req, res);
  } else if (req.method === 'POST') {
    return POST(req, res);
  } else if (req.method === 'DELETE') {
    return DELETE(req, res);
  } else if (req.method === 'PUT') {
    return PUT(req, res);
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'DELETE', 'PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

const server = createServer((req, res) => handler(req, res));

describe('API Routes', () => {
  beforeAll(async () => {
    await dbConnect();
  });

  afterAll(async () => {
    await closeDbConnection();
  });

  test('GET /api/messages should return all messages', async () => {
    const response = await request(server).get('/api/messages');
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });

  test('POST /api/messages should create a new message', async () => {
    const newMessage = {
      content: 'Test message',
      sender: 'Test sender',
      timestamp: new Date().toISOString(),
    };
    const response = await request(server).post('/api/messages').send(newMessage);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id');
    expect(response.body.content).toBe(newMessage.content);
    expect(response.body.sender).toBe(newMessage.sender);
  });

  test('DELETE /api/messages should delete a message by ID', async () => {
    const newMessage = {
      content: 'Message to delete',
      sender: 'Test sender',
      timestamp: new Date().toISOString(),
    };
    const postResponse = await request(server).post('/api/messages').send(newMessage);
    const messageId = postResponse.body.id;

    const deleteResponse = await request(server).delete('/api/messages').send({ id: messageId });
    expect(deleteResponse.status).toBe(200);
    expect(deleteResponse.body).toHaveProperty('success', true);
  });

  test('PUT /api/messages should update a message by ID', async () => {
    const newMessage = {
      content: 'Message to update',
      sender: 'Test sender',
      timestamp: new Date().toISOString(),
    };
    const postResponse = await request(server).post('/api/messages').send(newMessage);
    const messageId = postResponse.body.id;

    const updatedContent = 'Updated message content';
    const putResponse = await request(server).put('/api/messages').send({ id: messageId, content: updatedContent });
    expect(putResponse.status).toBe(200);
    expect(putResponse.body).toHaveProperty('success', true);

    const getResponse = await request(server).get('/api/messages');
    const updatedMessage = getResponse.body.find((msg) => msg.id === messageId);
    expect(updatedMessage.content).toBe(updatedContent);
  });
});
