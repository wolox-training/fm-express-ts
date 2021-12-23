import request from 'supertest';
import { factory } from 'factory-girl';
import userRepository from '../app/services/users';
import app from '../app';
import { User } from '../app/models/user';
import { encrypt } from '../app/helpers/crypto';
import { encode } from '../app/services/session';
import { ROLES } from '../app/constants';

factory.define('User', User, {
  name: factory.chance('name'),
  lastName: factory.chance('last', { middle: true }),
  email: factory.sequence('User.email', (n: number) => `dummy-user-${n}@wolox.com`),
  password: 'pa55word',
  role: ROLES.USER
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
    it('should return all users', async (done: jest.DoneCallback) => {
      const user: User = await factory.attrs('User');
      user.password = await encrypt(user.password);
      await userRepository.createMany([user]);
      const userToEncode = { id: user.id, email: user.email };
      const token = encode(userToEncode);
      request(app)
        .get('/users')
        .set({ Authorization: token })
        .query({ page: 2, limit: 1 })
        .expect(200)
        .then((res: request.Response) => {
          expect(res.body.length).toBe(1);
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
      user.email = 'dummy-user@wolox.com';
      await userRepository.createMany([user]);
      request(app)
        .post('/users')
        .send({ name: user.name, lastName: user.lastName, password: user.password, email: user.email })
        .expect(409)
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
  describe('/users/sessions POST', () => {
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
  describe('/admin/user POST', () => {
    it('User admin create a user admin', async (done: jest.DoneCallback) => {
      const adminUser: User = await factory.attrs('User');
      adminUser.password = await encrypt(adminUser.password);
      adminUser.role = ROLES.ADMIN;
      await userRepository.createMany([adminUser]);
      const token = encode(adminUser);
      const user: User = await factory.attrs('User');
      request(app)
        .post('/admin/users')
        .set({ Authorization: token })
        .send({
          name: user.name,
          lastName: user.lastName,
          password: user.password,
          email: user.email,
          role: ROLES.ADMIN
        })
        .expect(201)
        .then(async () => {
          const newuser = await userRepository.findUser({ name: user.name });
          expect(newuser).not.toBeNull();
          done();
        });
    });
    it('Error when user is not a admin', async (done: jest.DoneCallback) => {
      const adminUser: User = await factory.attrs('User');
      adminUser.password = await encrypt(adminUser.password);
      await userRepository.createMany([adminUser]);
      const token = encode(adminUser);
      const user: User = await factory.attrs('User');
      request(app)
        .post('/admin/users')
        .set({ Authorization: token })
        .send({
          name: user.name,
          lastName: user.lastName,
          password: user.password,
          email: user.email,
          role: ROLES.ADMIN
        })
        .expect(401)
        .then(() => {
          done();
        });
    });
  });
});
