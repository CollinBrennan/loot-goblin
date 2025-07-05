import { fetchFreeEpicGames } from '../api/epic';
import { DISCORD_MAX_EMBED_LENGTH } from '../constants';
import { putOffer } from '../db/offer';
import createGameEmbeds from '../embeds/game-embed';
import { epic } from '../services';
import type { Game } from '../types';

export const handler = async () => {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

  if (!webhookUrl) throw new Error('Discord webhook URL not defined');

  const games = await fetchFreeEpicGames();

  const gamesToPost: Game[] = [];

  for (const game of games) {
    const ttl = Math.floor(game.endDate.getTime() / 1000);

    try {
      await putOffer({ offerId: game.offerId, service: epic.name, ttl });
      gamesToPost.push(game);
    } catch {
      continue;
    }
  }

  if (gamesToPost.length > 0) {
    const embeds = createGameEmbeds(gamesToPost, epic).slice(
      0,
      DISCORD_MAX_EMBED_LENGTH,
    );
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ embeds }),
    });
  }
};
