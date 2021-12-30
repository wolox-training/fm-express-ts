import { Response, NextFunction, Request } from 'express';
import HttpStatus from 'http-status-codes';
import { alreadyExistError, databaseError } from '../errors';
import { Cards, CardsInfo } from '../interfaces/cards';
import { getInfo, getAllCards } from '../services/cards';
import { findSale, saveSale } from '../services/sale';
import { Sale } from '../models/sale';
import logger from '../logger';

export function getCards(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
  return getAllCards()
    .then((cards: Cards) => res.send(cards))
    .catch(next);
}

export function getCardsInfo(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
  return getInfo()
    .then((info: CardsInfo) => res.send(info))
    .catch(next);
}

export async function buyCard(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
  const { id } = req.params;
  const userId = req.user.id;
  const newSale = { cardId: id, userId };
  try {
    const sale = await findSale(newSale as Sale);

    if (sale) {
      logger.info('The user already buy the card');
      return next(alreadyExistError('The user already buy the card'));
    }

    await saveSale(newSale as Sale);
    return res.status(HttpStatus.ACCEPTED).send({ info: 'Purchase accepted' });
  } catch (error) {
    logger.info(`Error buyCard: ${error}`);
    return next(databaseError(`Error buyCard: ${error}`));
  }
}
