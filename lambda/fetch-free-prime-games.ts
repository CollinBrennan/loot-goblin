import { fetchFreePrimeGames } from '../api/prime';
import { DISCORD_MAX_EMBED_LENGTH } from '../constants';
import { putOffer } from '../db/offer';
import createGameEmbeds from '../embeds/game-embed';
import { prime } from '../services';

export const handler = async () => {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

  if (!webhookUrl) throw new Error('Discord webhook URL not defined');

  const games = await fetchFreePrimeGames();
  const embeds = createGameEmbeds(games, prime).slice(
    0,
    DISCORD_MAX_EMBED_LENGTH
  );

  games.forEach(({ offerId, endDate }) => {
    const ttl = Math.floor(endDate.getTime() / 1000);
    putOffer({ offerId, service: prime.name, ttl });
  });

  await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ embeds }),
  });
};
