import { functions } from '../firebase';
import { DISCORD_WEBHOOK_URL, PRODUCTION_GCLOUD_PROJECT } from '../constants';

import rp from 'request-promise';

////////////////////////////////////////////////////////////////////////////////
// authUserOnCreated
export const authUserOnCreated = functions.auth.user().onCreate(async (user) => {
  if (process.env.GCLOUD_PROJECT !== PRODUCTION_GCLOUD_PROJECT) {
    return;
  }

  try {
    await rp({
      method: 'POST',
      uri: DISCORD_WEBHOOK_URL,
      json: true,
      body: {
        content: `New user! https://campusgamingnetwork.com/user/${user.uid}`,
      },
    });
  } catch (error) {
    console.log(error);
  }

  return;
});
