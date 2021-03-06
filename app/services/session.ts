import jwt from 'jwt-simple';

import config from '../../config';

const SECRET: string = config.common.session.secret;

export const HEADER_NAME = config.common.session.header_name;

export function encode<T>(toEncode: T): string {
  return jwt.encode(toEncode, SECRET);
}

export function decode<T>(toDecode: string): T {
  return jwt.decode(toDecode, SECRET);
}

export default {
  encode,
  decode
};
