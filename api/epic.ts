import type { Game } from '../types';

const EPIC_FREE_GAMES_URL =
  'https://store-site-backend-static-ipv4.ak.epicgames.com/freeGamesPromotions';
const EPIC_STORE_BASE_URL = 'https://store.epicgames.com/p/';

type EpicGame = {
  title: string;
  promotions: {
    promotionalOffers: [
      {
        promotionalOffers: [{ endDate: Date }];
      }
    ];
  };
  keyImages: [
    {
      type: string;
      url: string;
    }
  ];
  urlSlug: string;
};

type EpicGamesApiResponse = {
  data: {
    Catalog: {
      searchStore: {
        elements: EpicGame[];
      };
    };
  };
};

export async function fetchFreeEpicGames() {
  const response = await fetch(EPIC_FREE_GAMES_URL);
  const data = (await response.json()) as EpicGamesApiResponse;
  const epicGames = data.data.Catalog.searchStore.elements;

  const freeGames = transformEpicGames(epicGames);
  return freeGames;
}

function transformEpicGames(epicGames: EpicGame[]): Game[] {
  const freeGames: Game[] = [];

  for (let game of epicGames) {
    const { title, promotions, keyImages, urlSlug } = game;
    const promotion =
      promotions?.promotionalOffers?.[0]?.promotionalOffers?.[0];

    const endDate = promotion?.endDate;
    const imageUrl = keyImages.find(
      ({ type }) => type === 'OfferImageWide'
    )?.url;
    const storeUrl = `${EPIC_STORE_BASE_URL}${urlSlug}`;

    if (!endDate || !imageUrl) continue;

    freeGames.push({ title, endDate, imageUrl, storeUrl });
  }

  return freeGames;
}
