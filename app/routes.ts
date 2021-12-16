import { Application } from 'express';
import { healthCheck } from './controllers/healthCheck';
import { getUsers, getUserById, createUser } from './controllers/users';
import { getTodos } from './controllers/todos';
import { getCardsInfo, getCards } from './controllers/cards';
import { userValidatorMiddleware } from './middlewares/user';

export const init = (app: Application): void => {
  app.get('/health', healthCheck);
  app.get('/users', getUsers);
  app.post('/users', userValidatorMiddleware, createUser);
  app.get('/users/:id', getUserById);
  app.get('/todos', getTodos);
  app.get('/info', getCardsInfo);
  app.get('/cards', getCards);
};
