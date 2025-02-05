import { MongoClient } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from './database';
import { handler as userHandler } from './users';
import { handler as postHandler } from './posts';
import { describe, it, expect } from 'jest';

describe('User API Routes', () => {
  let db;
  let usersCollection;

  beforeAll(async () => {
    db = await connectToDatabase();
    usersCollection = db.collection('users');
  });

  afterAll(async () => {
    await usersCollection.deleteMany({});
  });

  it('should register a new user', async () => {
    const req = {
      method: 'POST',
      body: {
        phoneNumber: '+919876543210',
        name: 'Test User',
        email: 'testuser@example.com',
      },
    } as NextApiRequest;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as NextApiResponse;

    await userHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: 'User registered successfully',
    }));
  });

  it('should get user profile', async () => {
    const req = {
      method: 'GET',
      query: {
        phoneNumber: '+919876543210',
      },
    } as NextApiRequest;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as NextApiResponse;

    await userHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      phoneNumber: '+919876543210',
      name: 'Test User',
      email: 'testuser@example.com',
    }));
  });

  it('should update user profile', async () => {
    const req = {
      method: 'PUT',
      body: {
        phoneNumber: '+919876543210',
        name: 'Updated User',
        email: 'updateduser@example.com',
      },
    } as NextApiRequest;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as NextApiResponse;

    await userHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: 'User profile updated successfully',
    }));
  });
});

describe('Post API Routes', () => {
  let db;
  let postsCollection;

  beforeAll(async () => {
    db = await connectToDatabase();
    postsCollection = db.collection('posts');
  });

  afterAll(async () => {
    await postsCollection.deleteMany({});
  });

  it('should create a new post', async () => {
    const req = {
      method: 'POST',
      body: {
        title: 'Test Post',
        content: 'This is a test post',
        author: 'Test User',
      },
    } as NextApiRequest;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as NextApiResponse;

    await postHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: 'Post created successfully',
    }));
  });

  it('should get all posts', async () => {
    const req = {
      method: 'GET',
    } as NextApiRequest;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as NextApiResponse;

    await postHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.arrayContaining([
      expect.objectContaining({
        title: 'Test Post',
        content: 'This is a test post',
        author: 'Test User',
      }),
    ]));
  });

  it('should update a post', async () => {
    const req = {
      method: 'PUT',
      body: {
        id: 'some-post-id',
        title: 'Updated Post',
        content: 'This is an updated post',
      },
    } as NextApiRequest;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as NextApiResponse;

    await postHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: 'Post updated successfully',
    }));
  });

  it('should delete a post', async () => {
    const req = {
      method: 'DELETE',
      body: {
        id: 'some-post-id',
      },
    } as NextApiRequest;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as NextApiResponse;

    await postHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: 'Post deleted successfully',
    }));
  });
});
