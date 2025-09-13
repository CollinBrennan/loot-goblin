import type { Offer } from '../types';

const EPIC_API_URL =
  'https://store-site-backend-static-ipv4.ak.epicgames.com/freeGamesPromotions';
const EPIC_STORE_BASE_URL = 'https://store.epicgames.com/p/';

type EpicOffer = {
  id: string;
  title: string;
  promotions?: {
    promotionalOffers: [{ promotionalOffers: [{ endDate: string }] }];
  };
  keyImages: [{ type: string; url: string }];
  catalogNs: {
    mappings?: [{ pageSlug: string }];
  };
  offerMappings?: [{ pageSlug: string }];
  price: {
    totalPrice: {
      originalPrice: number;
      discount: number;
      fmtPrice: {
        originalPrice: string;
      };
    };
  };
};

type EpicOffersApiResponse = {
  data: {
    Catalog: {
      searchStore: {
        elements: EpicOffer[];
      };
    };
  };
};

export async function fetchEpicOffers() {
  const response = await fetch(EPIC_API_URL);
  const data = (await response.json()) as EpicOffersApiResponse;
  const epicOffers = data.data.Catalog.searchStore.elements;

  const offers = transformEpicOffers(epicOffers);
  return offers;
}

function transformEpicOffers(epicOffers: EpicOffer[]): Offer[] {
  const offers: Offer[] = [];

  for (let epicOffer of epicOffers) {
    const {
      id,
      title,
      promotions,
      keyImages,
      catalogNs,
      offerMappings,
      price,
    } = epicOffer;

    // Skip if not free
    if (price.totalPrice.originalPrice !== price.totalPrice.discount) continue;

    const endDateString =
      promotions?.promotionalOffers?.[0]?.promotionalOffers?.[0].endDate;
    const imageUrl = keyImages.find(
      ({ type }) => type === 'OfferImageWide',
    )?.url;

    // Fall back to regular page slug if offer page slug is not available
    const pageSlug =
      offerMappings?.[0]?.pageSlug ?? catalogNs?.mappings?.[0]?.pageSlug;

    if (!endDateString || !imageUrl || !pageSlug) continue;

    const endDate = new Date(endDateString);
    const storeUrl = `${EPIC_STORE_BASE_URL}${pageSlug}`;
    const originalPrice = price.totalPrice.fmtPrice.originalPrice;

    offers.push({
      id,
      title,
      endDate,
      imageUrl,
      storeUrl,
      originalPrice,
    });
  }

  return offers;
}
