import { NextFunction, Request, Response } from 'express';
import { Cards } from '../interfaces/cards';
import { badRequestError } from '../errors';
import logger from '../logger';
import cards from '../services/cards';

export function cardValidator(req: Request, res: Response, next: NextFunction): void {
  const { id } = req.params;

  cards
    .getCardById(id)
    .then((card: Cards) => {
      if (!card) {
        logger.info('Card not found');
        return next(badRequestError('Card not found'));
      }
      return next();
    })
    .catch(next);
}
