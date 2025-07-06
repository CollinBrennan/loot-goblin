const command = {
  name: 'ping',
  description: 'Replies with Pong!',
  type: 1, // CHAT_INPUT
};

const { DISCORD_BOT_TOKEN, DISCORD_CLIENT_ID } = process.env;

if (!DISCORD_BOT_TOKEN || !DISCORD_CLIENT_ID) {
  console.error('Missing DISCORD_BOT_TOKEN or DISCORD_CLIENT_ID');
  process.exit(1);
}

const url = `https://discord.com/api/v10/applications/${DISCORD_CLIENT_ID}/commands`;
const res = await fetch(url, {
  method: 'POST',
  headers: {
    Authorization: `Bot ${DISCORD_BOT_TOKEN}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(command),
});

if (!res.ok) {
  console.error('Failed to register command:', await res.text());
  process.exit(1);
} else {
  console.log('✅ Slash command registered!');
}
