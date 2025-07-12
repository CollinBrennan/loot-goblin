import type { Embed } from 'discord.js';
import type { Offer, Service } from '../types';
import { epochInSeconds } from '../utils/date-time';

export default function createOfferEmbeds(offers: Offer[], service: Service) {
  return offers.map((offer) => createOfferEmbed(offer, service));
}

function createOfferEmbed(offer: Offer, service: Service): Partial<Embed> {
  const price = offer.originalPrice ? `~~${offer.originalPrice}~~ ` : '';
  const timestamp = epochInSeconds(offer.endDate);

  const offerEmbed: Partial<Embed> = {
    color: 0xffffff,
    title: offer.title,
    description: `${price}**Free!** Offer ends <t:${timestamp}:R>`,
    thumbnail: { url: service.thumbnail },
    fields: [
      {
        name: '\u200b',
        value: `[**Claim on ${service.name} ↗**](${offer.storeUrl})`,
        inline: true,
      },
    ],
    image: { url: offer.imageUrl },
  };

  return offerEmbed;
}
