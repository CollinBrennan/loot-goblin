import { fetchFreeEpicGames } from '../api/epic';
import { DISCORD_MAX_EMBED_LENGTH } from '../constants';
import createGameEmbeds from '../embeds.ts/game-embed';

export const handler = async () => {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

  if (!webhookUrl) throw new Error('Discord webhook URL not defined');

  const games = await fetchFreeEpicGames();
  const embeds = createGameEmbeds(games).slice(0, DISCORD_MAX_EMBED_LENGTH);

  await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ embeds }),
  });
};
