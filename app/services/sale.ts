import { FindConditions, getRepository, Repository } from 'typeorm';

import { Sale } from '../models/sale';

const userRepository = (): Repository<Sale> => getRepository(Sale);

export function findSale(options?: FindConditions<Sale>): Promise<Sale | undefined> {
  return userRepository().findOne(options);
}

export function saveSale(sale: Sale): Promise<Sale> {
  return userRepository().save(sale);
}
