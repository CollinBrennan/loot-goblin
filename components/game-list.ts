import { format } from 'date-fns';
import type { Game } from '../types';
import { DISCORD_MAX_COMPONENTS_LENGTH } from '../constants';

export function createGameList(games: Game[]) {
  const COMPONENTS_PER_GAME = 5;
  const maxGames = Math.floor(
    DISCORD_MAX_COMPONENTS_LENGTH / COMPONENTS_PER_GAME
  );

  const components = games.map((game) => ({
    type: 17,
    components: [
      {
        type: 12,
        items: [
          {
            media: { url: game.imageUrl },
          },
        ],
      },
      {
        type: 10,
        content: `# ${game.title}\n-# Free until ${format(
          game.endDate,
          'MMM Q'
        )}`,
      },
      {
        type: 1,
        components: [
          {
            type: 2,
            label: 'Claim',
            style: 5,
            url: game.storeUrl,
          },
        ],
      },
    ],
  }));

  return {
    flags: 32768,
    components: components.slice(0, maxGames),
  };
}
