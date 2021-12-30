import { Application } from 'express';
import { healthCheck } from './controllers/healthCheck';
import { getUsers, getUserById, createUser, login, createAdminUser } from './controllers/users';
import { getTodos } from './controllers/todos';
import { getCardsInfo, getCards, buyCard } from './controllers/cards';
import { userValidatorMiddleware, loginValidatorMiddleware } from './middlewares/user';
import { secure, adminRole } from './middlewares/auth';
import { cardValidator } from './middlewares';

export const init = (app: Application): void => {
  app.get('/health', healthCheck);
  app.get('/users', secure, getUsers);
  app.post('/users', userValidatorMiddleware, createUser);
  app.get('/users/:id', getUserById);
  app.get('/todos', getTodos);
  app.get('/info', getCardsInfo);
  app.get('/cards', getCards);
  app.post('/users/sessions', loginValidatorMiddleware, login);
  app.post('/admin/users', secure, adminRole, userValidatorMiddleware, createAdminUser);
  app.post('/cards/:id', secure, cardValidator, buyCard);
};
