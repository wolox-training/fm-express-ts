import bcryptjs from 'bcryptjs';

export function encrypt(data: string): string {
  const salt: string = bcryptjs.genSaltSync(10);
  return bcryptjs.hashSync(data, salt);
}

export function compareEncrypt(hash: string, data: string): boolean {
  if (hash && data) {
    return bcryptjs.compareSync(data, hash);
  }
  return false;
}

export default { encrypt, compareEncrypt };
