import { fetchFreeEpicGames } from '../api/epic';
import { createGameList } from '../components/game-list';
import createGameEmbeds from '../embeds.ts/game-embed';

export const handler = async () => {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

  if (!webhookUrl) {
    console.error('Missing DISCORD_WEBHOOK_URL');
    return {
      statusCode: 500,
      body: 'Webhook URL not configured.',
    };
  }

  try {
    const games = await fetchFreeEpicGames();
    const embeds = createGameEmbeds(games);

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ embeds }),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Failed to send message: ${response.status} ${text}`);
    }

    return {
      statusCode: 200,
      body: 'Message sent to Discord.',
    };
  } catch (err) {
    console.error('Error sending message:', err);
    return {
      statusCode: 500,
      body: `Error: ${err.message}`,
    };
  }
};
