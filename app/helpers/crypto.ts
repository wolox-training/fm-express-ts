import bcryptjs from 'bcryptjs';
import logger from '../logger';

export async function encrypt(data: string): Promise<string> {
  try {
    const salt: string = await bcryptjs.genSalt(10);
    return await bcryptjs.hash(data, salt);
  } catch (error) {
    throw new Error(`Helper encrypt: ${error}`);
  }
}

export async function compareEncrypt(hash: string, data: string): Promise<boolean> {
  try {
    if (hash && data) {
      return await bcryptjs.compare(data, hash);
    }
    logger.error('compareEncrypt: not found params hash or data');
    return false;
  } catch (error) {
    logger.error(`compareEncrypt Error:${error}`);
    return false;
  }
}

export default { encrypt, compareEncrypt };
