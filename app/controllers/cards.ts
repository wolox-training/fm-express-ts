import { Response, NextFunction, Request } from 'express';
import { Cards, CardsInfo } from '../interfaces/cards';
import { getInfo, getAllCards } from '../services/cards';

export function getCards(_: Request, res: Response, next: NextFunction): Promise<Response | void> {
  return getAllCards()
    .then((cards: Cards) => res.send(cards))
    .catch(next);
}

export function getCardsInfo(_: Request, res: Response, next: NextFunction): Promise<Response | void> {
  return getInfo()
    .then((info: CardsInfo) => res.send(info))
    .catch(next);
}
