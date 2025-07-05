import type { Game } from '../types';

const PRIME_API_URL = 'https://gql.twitch.tv/gql';

type PrimeGame = {
  id: string;
  tags: string[];
  content: {
    externalURL: string;
  };
  gameTitle: string;
  endTime: Date;
  imageURL: string;
};

type PrimeGamesApiResponse = [
  {
    data: {
      primeOffersWithEligibility: PrimeGame[];
    };
  }
];

export async function fetchFreePrimeGames() {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Client-Id': 'kimne78kx3ncx6brgo4mv6wki5h1ko',
      Accept: 'application/json',
    },
    body: JSON.stringify([
      {
        operationName: 'Prime_PrimeOfferList_PrimeOffers_Eligibility',
        variables: {},
        extensions: {
          persistedQuery: {
            version: 1,
            sha256Hash:
              '630945e9a3b4edbcadb1494b0c77b43301199ca0717ad35f712c2f81f7951690',
          },
        },
      },
    ]),
  };
  const response = await fetch(PRIME_API_URL, options);
  const data = (await response.json()) as PrimeGamesApiResponse;
  const games = data[0].data.primeOffersWithEligibility;

  const freeGames = transformPrimeGames(games);
  return freeGames;
}

function transformPrimeGames(primeGames: PrimeGame[]): Game[] {
  const freeGames: Game[] = [];

  for (let game of primeGames) {
    const {
      id: offerId,
      tags,
      content,
      gameTitle: title,
      endTime,
      imageURL: imageUrl,
    } = game;

    if (!tags.includes('FGWP')) continue;

    freeGames.push({
      offerId,
      title,
      endDate: new Date(endTime),
      imageUrl,
      storeUrl: content.externalURL,
    });
  }

  return freeGames;
}
