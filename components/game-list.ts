import { format } from 'date-fns';
import type { Game } from '../types';

export function createGameList(games: Game[]) {
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
      { type: 10, content: `# ${game.title}` },
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
      {
        type: 10,
        content: `-# Free until ${format(game.endDate, 'MMM Q')}`,
      },
    ],
  }));

  return {
    flags: 32768,
    components,
  };
}
