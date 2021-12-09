import { NextFunction, Request, Response } from 'express';
import HttpStatus from 'http-status-codes';
import { encrypt } from '../helpers/crypto';
import logger from '../logger';
import { isAlphabetic, isAlphaNumeric, isEmailValid } from '../helpers/validator';
import userService from '../services/users';
import { User } from '../models/user';
import { notFoundError, badRequestError, databaseError } from '../errors';

async function userValidator(
  firstName: string,
  lastName: string,
  password: string,
  email: string
): Promise<string | null> {
  try {
    if (!isAlphabetic(firstName)) {
      return 'the name has to be only contain alphabetic characters';
    }

    if (!isAlphabetic(lastName)) {
      return 'the last name has to be only contain alphabetic characters';
    }

    if (password && (!isAlphaNumeric(password) || password.length < 8 || password.length > 8)) {
      return 'the password has to be alphanumeric asnd have length major to 8';
    }
    const existEmail = await userService.findUser({ email });
    if (!isEmailValid(email)) {
      return 'invalid email';
    }

    if (existEmail) {
      return 'email already exist';
    }

    return null;
  } catch (error) {
    throw new Error('Error in userValidator');
  }
}

export function getUsers(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
  return userService
    .findAll()
    .then((users: User[]) => res.send(users))
    .catch(next);
}

export async function createUser(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
  const { name, lastName, password, email } = req.body;

  if (!name || !lastName || !password || !email) {
    return next(badRequestError('createUser: Error with params'));
  }

  const validUser = await userValidator(name, lastName, password, email);
  if (validUser) {
    return next(badRequestError(`createUser: Error to create new user,${validUser}`));
  }

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
