import { Response, NextFunction, Request } from 'express';

import SessionManager, { HEADER_NAME } from '../services/session';
import userService from '../services/users';
import { User } from '../models/user';
import { authenticationError } from '../errors';
import { ROLES } from '../constants';
import logger from '../logger';

export async function secure(req: Request, res: Response, next: NextFunction): Promise<void> {
  const auth = req.headers[HEADER_NAME] as string;

  if (auth) {
    const payload: User = SessionManager.decode(auth);
    const user: User | undefined = await userService.findUser({ id: payload.id });
    if (user) {
      req.user = user;
      return next();
    }
  }
  return next(authenticationError('Error: Unauthorized'));
}

export function adminRole(req: Request, res: Response, next: NextFunction): void {
  if (req.user && req.user.role === ROLES.ADMIN) {
    return next();
  }
  logger.info('Error: Rol Unauthorized');
  return next(authenticationError('Error: Rol Unauthorized'));
  // res.status(HTTP_CODES.UNAUTHORIZED).json({ message: ERROR_MESSAGE.UNAUTHORIZED });
}
