import { randomInt } from 'crypto';

export function generateOtp(): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let otp = '';

  for (let i = 0; i < 6; i++) {
    otp += characters[randomInt(0, characters.length)];
  }

  return otp;
}