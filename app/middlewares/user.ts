import { NextFunction, Request, Response } from 'express';
import userService from '../services/users';
import { isAlphabetic, isAlphaNumeric, isEmailValid } from '../helpers/validator';
import { badRequestError } from '../errors';
import logger from '../logger';

export function userValidator(
  firstName: string,
  lastName: string,
  password: string,
  email: string
): string | null {
  try {
    if (!isAlphabetic(firstName)) {
      return 'the name has to be only contain alphabetic characters';
    }

    if (!isAlphabetic(lastName)) {
      return 'the last name has to be only contain alphabetic characters';
    }

    if (password && (!isAlphaNumeric(password) || password.length < 8 || password.length > 8)) {
      return 'the password has to be alphanumeric and have length major to 8';
    }

    if (!isEmailValid(email)) {
      return 'invalid email';
    }

    return null;
  } catch (error) {
    throw new Error('Error in userValidator');
  }
}

export async function userValidatorMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const { name, lastName, password, email } = req.body;
  if (!name || !lastName || !password || !email) {
    logger.info('createUser: Error with params');
    return next(badRequestError('createUser: Error with params'));
  }

  const validUser = await userValidator(name, lastName, password, email);
  if (validUser) {
    logger.info(`createUser: Error to create new user,${validUser}`);
    return next(badRequestError(`createUser: Error to create new user,${validUser}`));
  }
  return next();
}

export async function loginValidatorMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<string | void> {
  const { email, password } = req.body;
  if (!password || !email) {
    return next(badRequestError('Login: some parameter is missing'));
  }

  if (!isEmailValid) {
    return next(badRequestError('Login: Invalid email'));
  }

  const user = await userService.findUser({ email });
  req.user = user;
  if (!user) {
    logger.info('User not found');
    return next(badRequestError('Login: email not found'));
  }
  return next();
}
