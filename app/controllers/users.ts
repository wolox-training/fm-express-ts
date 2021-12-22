import { NextFunction, Request, Response } from 'express';
import HttpStatus from 'http-status-codes';
import { encrypt, compareEncrypt } from '../helpers/crypto';
import logger from '../logger';
import userService from '../services/users';
import { User } from '../models/user';
import { notFoundError, databaseError, authenticationError, badRequestError } from '../errors';
import { encode } from '../services/session';

export function getUsers(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
  const page: number = Number(req.query.page) || 1;
  const take: number = Number(req.query.limit) || 5;

  if (page <= 0 || take <= 0) {
    next(badRequestError('Error: bad query'));
  }

  const skip: number = (page - 1) * take;

  return userService
    .findAll({ skip, take })
    .then((users: User[]) => res.send(users))
    .catch(() => {
      next(databaseError('getUser: erro when get users'));
    });
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

export async function login(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
  try {
    const { user } = req;
    const { password } = req.body;

    if (!user) {
      return next(authenticationError('Error: user not found'));
    }
    const passValid: boolean = await compareEncrypt(user.password, password);

    if (!passValid) {
      return next(authenticationError('Error: password invalid'));
    }
    const userToEncode = { id: user.id, email: user.email };
    const token = encode(userToEncode);
    return res.status(HttpStatus.OK).send({ token });
  } catch (error) {
    logger.error(`login error ${error}`);
    return next(databaseError('Database error'));
  }
}
