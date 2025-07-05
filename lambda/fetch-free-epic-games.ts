import { fetchFreeEpicGames } from '../api/epic';
import { DISCORD_MAX_EMBED_LENGTH } from '../constants';
import { tryPutOffer } from '../db/offer';
import createGameEmbeds from '../embeds/game-embed';
import { epic } from '../services';
import type { Game } from '../types';
import { epochInSeconds } from '../utils/date-time';

export const handler = async () => {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl) throw new Error('Discord webhook URL not defined');

  const games = await fetchFreeEpicGames();
  const gamesToPost: Game[] = [];

  for (const game of games) {
    if (gamesToPost.length >= DISCORD_MAX_EMBED_LENGTH) break;

    // Don't post the offer if it exists in the db
    try {
      await tryPutOffer({
        offerId: game.offerId,
        service: epic.name,
        ttl: epochInSeconds(game.endDate),
      });
      gamesToPost.push(game);
    } catch {
      continue;
    }
  }

  if (gamesToPost.length > 0) {
    const embeds = createGameEmbeds(gamesToPost, epic);
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ embeds }),
    });
  }

  const logData = {
    gamesFetched: games.length,
    gamesPosted: gamesToPost.length,
  };

  console.log(logData);
  return logData;
};
