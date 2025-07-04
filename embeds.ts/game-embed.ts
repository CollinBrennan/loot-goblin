// at the top of your file
import { type Embed } from 'discord.js';
import type { Game } from '../types';
import { format } from 'date-fns';

export default function createGameEmbeds(games: Game[]) {
  return games.map((game) => createGameEmbed(game));
}

function createGameEmbed({
  title,
  endDate,
  imageUrl,
  storeUrl,
}: Game): Partial<Embed> {
  const gameEmbed: Partial<Embed> = {
    color: 0xffffff,
    title,
    description: `**Free** until ${format(endDate, 'MMM Q')}`,
    thumbnail: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/3/39/Epic_Games_Store_logo_2023_vertical_white.png',
    },
    fields: [
      {
        name: '\u200b',
        value: `[**Claim ↗**](${storeUrl})`,
        inline: true,
      },
    ],
    image: { url: imageUrl },
  };

  return gameEmbed;
}
