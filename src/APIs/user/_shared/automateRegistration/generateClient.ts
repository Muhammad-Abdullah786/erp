import crypto from "crypto";
// import { getClientByUsername } from "../repository/clientRepository";
import userRepo from '../../_shared/repo/user.repository'

export const generateRandomPassword = (length: number = 12): string => {
  return crypto.randomBytes(length).toString("base64").slice(0, length);
};

export const generateRandomString = (minLength: number, maxLength: number): string => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const length = Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  };
  


export const generateUniqueUsername = async (name: string): Promise<string> => {
    let uniqueUsername = name;
    let attempts = 0;
  
    // Attempt to generate a unique username
    while (await userRepo.findUserByName(uniqueUsername)) {
      if (attempts >= 5) {
        throw new Error('Failed to generate a unique username');
      }
      uniqueUsername = `${name}_${crypto.randomBytes(3).toString('hex')}`;
      attempts++;
    }
  
    return uniqueUsername;
  };