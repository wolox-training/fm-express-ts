import { NextFunction, Request, Response } from 'express';
import HttpStatus from 'http-status-codes';
import { encrypt } from '../helpers/crypto';
import logger from '../logger';
import userService from '../services/users';
import { User } from '../models/user';
import { notFoundError, databaseError } from '../errors';

export function getUsers(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
  return userService
    .findAll()
    .then((users: User[]) => res.send(users))
    .catch(next);
}

export async function createUser(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
  const { name, lastName, password, email } = req.body;

  try {
    const passwordEncrypt: string = await encrypt(password);
    const newUser = await userService.create({ name, lastName, password: passwordEncrypt, email } as User);
    logger.info(`User ${newUser.name} ${newUser.lastName} created`);
    return res.status(HttpStatus.CREATED).send({ newUser });
  } catch (error) {
    return next(databaseError(`createUser: Error saving new user ${error}`));
  }
}

export function getUserById(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
  return userService
    .findUser({ id: parseInt(req.params.id) })
    .then((user: User) => {
      if (!user) {
        throw notFoundError('User not found');
      }
      return res.send(user);
    })
    .catch(next);
}
