import axios from 'axios';
import config from '../../config';
import { externalApiError } from '../errors';
import { Cards, CardsInfo } from '../interfaces/cards';

const BASE_URL = config.hearthstone.baseURL;
const KEY = config.hearthstone.secret;

const card = axios.create({
  baseURL: BASE_URL,
  responseType: 'json',
  headers: {
    'x-rapidapi-host': 'omgvamp-hearthstone-v1.p.rapidapi.com',
    'x-rapidapi-key': KEY
  }
});

export async function getAllCards(): Promise<Cards> {
  try {
    const response = await card.get<Cards>('cards');
    return response.data;
  } catch (error) {
    throw externalApiError(`External API error getting all cards ${error}`);
  }
}

export async function getInfo(): Promise<CardsInfo> {
  try {
    const response = await card.get<CardsInfo>('info');
    return response.data;
  } catch (error) {
    throw externalApiError(`External API error gettinf cards info ${error}`);
  }
}

export default {
  getAllCards,
  getInfo
};
