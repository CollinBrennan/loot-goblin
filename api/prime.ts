import type { Offer } from '../types';

const PRIME_API_URL = 'https://gql.twitch.tv/gql';
const REQUEST_BODY_OPTIONS = {
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

type PrimeOffer = {
  id: string;
  tags: string[];
  content: {
    externalURL: string;
  };
  gameTitle: string;
  endTime: Date;
  imageURL: string;
};

type PrimeOffersApiResponse = [
  {
    data: {
      primeOffersWithEligibility: PrimeOffer[];
    };
  },
];

export async function fetchPrimeOffers() {
  const response = await fetch(PRIME_API_URL, REQUEST_BODY_OPTIONS);
  const data = (await response.json()) as PrimeOffersApiResponse;
  const primeOffers = data[0].data.primeOffersWithEligibility;

  const offers = transformPrimeOffers(primeOffers);
  return offers;
}

function transformPrimeOffers(primeOffers: PrimeOffer[]): Offer[] {
  const offers: Offer[] = [];

  for (let primeOffer of primeOffers) {
    const {
      id,
      tags,
      content,
      gameTitle: title,
      endTime,
      imageURL: imageUrl,
    } = primeOffer;

    if (!tags.includes('FGWP')) continue;

    offers.push({
      id,
      title,
      endDate: new Date(endTime),
      imageUrl,
      storeUrl: content.externalURL,
    });
  }

  return offers;
}
