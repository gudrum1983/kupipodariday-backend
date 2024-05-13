import * as bcrypt from 'bcrypt';

//todo Вынести переменные???

export async function hashValue(value: string): Promise<string> {
  const saltRounds = 10;
  const salt = bcrypt.genSaltSync(saltRounds);
  return await bcrypt.hash(value, salt);
}

export async function verifyHash(
  value: string,
  hash: string,
): Promise<boolean> {
  return await bcrypt.compare(value, hash);
}
