import dotenv from 'dotenv';

dotenv.config();

const { DISCORD_PUBLIC_KEY, DISCORD_BOT_TOKEN, DISCORD_CLIENT_ID } =
  process.env;

if (!DISCORD_PUBLIC_KEY || !DISCORD_BOT_TOKEN || !DISCORD_CLIENT_ID) {
  throw new Error('Missing environment variables');
}

export const config = {
  DISCORD_PUBLIC_KEY,
  DISCORD_BOT_TOKEN,
  DISCORD_CLIENT_ID,
};
