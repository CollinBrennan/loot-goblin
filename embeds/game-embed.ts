import type { Embed } from 'discord.js';
import type { Game, Service } from '../types';

export default function createGameEmbeds(games: Game[], service: Service) {
  return games.map((game) => createGameEmbed(game, service));
}

function createGameEmbed(game: Game, service: Service): Partial<Embed> {
  const price = game.originalPrice ? `~~${game.originalPrice}~~` : '';
  const timestamp = Math.floor(game.endDate.getTime() / 1000);

  const gameEmbed: Partial<Embed> = {
    color: 0xffffff,
    title: game.title,
    description: `${price} **Free!** Offer ends <t:${timestamp}:R>`,
    thumbnail: { url: service.thumbnail },
    fields: [
      {
        name: '\u200b',
        value: `[**Claim on ${service.displayName} ↗**](${game.storeUrl})`,
        inline: true,
      },
    ],
    image: { url: game.imageUrl },
  };

  return gameEmbed;
}
