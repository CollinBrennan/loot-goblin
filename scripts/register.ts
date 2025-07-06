import { registeredCommands } from '../commands';
import { DISCORD_API_URL } from '../constants';

const { DISCORD_BOT_TOKEN, DISCORD_CLIENT_ID } = process.env;

if (!DISCORD_BOT_TOKEN || !DISCORD_CLIENT_ID) {
  console.error('Missing DISCORD_BOT_TOKEN or DISCORD_CLIENT_ID');
  process.exit(1);
}

const url = `${DISCORD_API_URL}/applications/${DISCORD_CLIENT_ID}/commands`;
const res = await fetch(url, {
  method: 'PUT',
  headers: {
    Authorization: `Bot ${DISCORD_BOT_TOKEN}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(registeredCommands),
});

if (!res.ok) {
  console.error('Failed to register commands:', await res.text());
  process.exit(1);
} else {
  console.log('Slash commands registered successfully!');
}
