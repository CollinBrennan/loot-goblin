import type { Game } from '../types';

const EPIC_FREE_GAMES_URL =
  'https://store-site-backend-static-ipv4.ak.epicgames.com/freeGamesPromotions';
const EPIC_STORE_BASE_URL = 'https://store.epicgames.com/p/';

type EpicGame = {
  title: string;
  promotions: {
    promotionalOffers: [{ promotionalOffers: [{ endDate: string }] }];
  };
  keyImages: [{ type: string; url: string }];
  catalogNs: {
    mappings?: [{ pageSlug: string }];
  };
  price: {
    totalPrice: {
      fmtPrice: {
        originalPrice: string;
      };
    };
  };
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
    const { title, promotions, keyImages, catalogNs } = game;

    const endDateString =
      promotions?.promotionalOffers?.[0]?.promotionalOffers?.[0].endDate;
    const imageUrl = keyImages.find(
      ({ type }) => type === 'OfferImageWide'
    )?.url;
    const pageSlug = catalogNs.mappings?.[0].pageSlug;

    if (!endDateString || !imageUrl || !pageSlug) continue;

    const endDate = new Date(endDateString);
    const storeUrl = `${EPIC_STORE_BASE_URL}${pageSlug}`;
    const originalPrice = game.price.totalPrice.fmtPrice.originalPrice;

    freeGames.push({ title, endDate, imageUrl, storeUrl, originalPrice });
  }

  return freeGames;
}
