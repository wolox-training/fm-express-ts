import request from 'supertest';
import { factory } from 'factory-girl';
import userRepository from '../app/services/users';
import app from '../app';
import { User } from '../app/models/user';
import { encrypt } from '../app/helpers/crypto';

factory.define('User', User, {
  name: factory.chance('name'),
  lastName: factory.chance('last', { middle: true }),
  email: factory.sequence('User.email', (n: number) => `dummy-user-${n}@wolox.com`),
  password: factory.sequence('User.password', (n: number) => `passwor${n}`)
});

describe('users', () => {
  beforeEach(async () => {
    const user1: User = await factory.attrs('User');
    const user2: User = await factory.attrs('User');

    user1.password = await encrypt(user1.password);
    user2.password = await encrypt(user2.password);
    await userRepository.createMany([user1, user2]);
  });
  describe('/users GET', () => {
    it('should return all users', (done: jest.DoneCallback) => {
      request(app)
        .get('/users')
        .expect(200)
        .then((res: request.Response) => {
          expect(res.body.length).toBe(2);
          done();
        });
    });
  });
  describe('/users POST', () => {
    it('create user', async (done: jest.DoneCallback) => {
      const user: User = await factory.attrs('User');
      request(app)
        .post('/users')
        .send({ name: user.name, lastName: user.lastName, password: user.password, email: user.email })
        .expect(201)
        .then(async () => {
          const newuser = await userRepository.findUser({ name: user.name });
          expect(newuser).not.toBeNull();
          done();
        });
    });
    it('should return error for email is already use', async (done: jest.DoneCallback) => {
      const user: User = await factory.attrs('User');
      user.email = 'dummy-user-6@wolox.com';
      request(app)
        .post('/users')
        .send({ name: user.name, lastName: user.lastName, password: user.password, email: user.email })
        .expect(400)
        .then((res: request.Response) => {
          expect(res.body).toHaveProperty('message');
          expect(res.body).toHaveProperty('internal_code');
          done();
        });
    });
    it("should return error for password the password doesn't meet the requirements", async (done: jest.DoneCallback) => {
      const user: User = await factory.attrs('User');
      user.password = 'asd1';
      request(app)
        .post('/users')
        .send({ name: user.name, lastName: user.lastName, password: user.password, email: user.email })
        .expect(400)
        .then((res: request.Response) => {
          expect(res.body).toHaveProperty('message');
          expect(res.body).toHaveProperty('internal_code');
          done();
        });
    });
    it('should return error for not send any parameter required', async (done: jest.DoneCallback) => {
      const user: User = await factory.attrs('User');
      user.password = 'asd1';
      request(app)
        .post('/users')
        .send({})
        .expect(400)
        .then((res: request.Response) => {
          expect(res.body).toHaveProperty('message');
          expect(res.body).toHaveProperty('internal_code');
          done();
        });
    });
  });
  describe('/users/:id GET', () => {
    it('should return user with id 1', (done: jest.DoneCallback) => {
      request(app)
        .get('/users/1')
        .expect(200)
        .then((res: request.Response) => {
          expect(res.body).toHaveProperty('id');
          done();
        });
    });
    it('should return error for user with id 5', (done: jest.DoneCallback) => {
      request(app)
        .get('/users/5')
        .expect(404)
        .then((res: request.Response) => {
          expect(res.body).toHaveProperty('message');
          expect(res.body).toHaveProperty('internal_code');
          done();
        });
    });
  });
  describe('/users/sessions', () => {
    it('correct login return token', async (done: jest.DoneCallback) => {
      const user: User = await factory.attrs('User');
      const noEncryptPass = user.password;
      user.password = await encrypt(user.password);
      await userRepository.createMany([user]);
      request(app)
        .post('/users/sessions')
        .send({ email: user.email, password: noEncryptPass })
        .expect(200)
        .then((res: request.Response) => {
          expect(res.body).toHaveProperty('token');
          done();
        });
    });
  });
});
