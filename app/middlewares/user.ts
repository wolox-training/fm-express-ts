import { NextFunction, Request, Response } from 'express';
import userService from '../services/users';
import { isAlphabetic, isAlphaNumeric, isEmailValid } from '../helpers/validator';
import { badRequestError } from '../errors';

export async function userValidator(
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

export async function userValidatorMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const { name, lastName, password, email } = req.body;

  if (!name || !lastName || !password || !email) {
    return next(badRequestError('createUser: Error with params'));
  }

  const validUser = await userValidator(name, lastName, password, email);
  if (validUser) {
    return next(badRequestError(`createUser: Error to create new user,${validUser}`));
  }

  return next();
}