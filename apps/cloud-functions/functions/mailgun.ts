import formData from 'form-data';
import Mailgun from 'mailgun.js';
import { MAILGUN_API_KEY, MAILGUN_DOMAIN, MAILGUN_USERNAME } from './constants';
// @ts-ignore
const mailgun = new Mailgun(formData);
const mg = mailgun.client({
  username: MAILGUN_USERNAME,
  key: MAILGUN_API_KEY,
});

const sendMail = async (from: string, to: string, subject: string, text: string, html: string): Promise<any> => {
  try {
    return await mg.messages.create(MAILGUN_DOMAIN, {
      from,
      to,
      subject,
      text,
      html,
    });
  } catch (error) {
    console.log('error', error);
    return error;
  }
};

export const sendEventEmail = async (to: string, subject: string, text: string, html: string): Promise<any> => {
  return await sendMail('events@campusgamingnetwork.com', to, subject, text, html);
};

export const sendSupportEmail = async (to: string, subject: string, text: string, html: string): Promise<any> => {
  return await sendMail('support@campusgamingnetwork.com', to, subject, text, html);
};
