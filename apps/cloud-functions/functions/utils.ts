import { customAlphabet } from 'nanoid';
import * as bcrypt from 'bcrypt';
import { NANO_ALPHABET, NANO_ID_LENGTH, SALT_ROUNDS } from './constants';

// Returns a callable function
export const nanoid = customAlphabet(NANO_ALPHABET, NANO_ID_LENGTH);

export const shallowEqual = (object1: { [key: string]: unknown }, object2: { [key: string]: unknown }): boolean => {
  const keys1 = Object.keys(object1);
  const keys2 = Object.keys(object2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (const key of keys1) {
    if (object1[key] !== object2[key]) {
      return false;
    }
  }

  return true;
};

export const changeLog = (prev: string, curr: string): string => `${prev} -> ${curr}`;

export const isValidEmail = (email: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const hashPassword = async (password: string): Promise<string> => await bcrypt.hash(password, SALT_ROUNDS);

export const comparePasswords = async (password: string, hash: string): Promise<boolean> =>
  await bcrypt.compare(password, hash);

export const createEventResponseEmail = (event: { [key: string]: any }): string => {
  const description = event.description.length > 250 ? `${event.description.substring(0, 250)}...` : event.description;
  const startDateTime = new Date(event.startDateTime.seconds * 1000).toString();
  const endDateTime = new Date(event.endDateTime.seconds * 1000).toString();
  const where = event.isOnline ? 'Online' : event.location || 'N/A';

  return `
  <span><span style='font-weight: bold;'>Event:</span> ${event.name}</span><
  <br />
  <span><span style='font-weight: bold;'>Date/Time Start:</span> ${startDateTime}</span>
  <br />
  <span><span style='font-weight: bold;'>Date/Time End:</span> ${endDateTime}</span>
  <br />
  <span><span style='font-weight: bold;'>Where:</span> ${where}</span>
  <br />
  <span><span style='font-weight: bold;'>Details:</span> ${description}</span>
  <br />
  <a href="https://campusgamingnetwork.com/event/${event.id}" target="_blank">View Full Event Details</a>
  `.trim();
};
