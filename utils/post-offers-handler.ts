import { DISCORD_MAX_EMBED_LENGTH } from '../constants';
import { tryPutOffer } from '../db/offer';
import { getWebhooksByService } from '../db/webhook';
import createOfferEmbeds from '../embeds/offer-embed';
import type { Offer, Service } from '../types';
import { epochInSeconds } from './date-time';

async function postOffersHandler(
  fetchOffers: () => Promise<Offer[]>,
  service: Service,
) {
  const fetchedOffers = await fetchOffers();
  const offers = fetchedOffers.slice(0, DISCORD_MAX_EMBED_LENGTH);
  const offersToPost: Offer[] = [];

  // Don't post the offer if it exists in the db
  for (const offer of offers) {
    try {
      await tryPutOffer({
        offerId: offer.id,
        serviceId: service.id,
        ttl: epochInSeconds(offer.endDate),
      });
      offersToPost.push(offer);
    } catch (e) {
      console.log(e);
      continue;
    }
  }

  const webhooks = await getWebhooksByService(service.id);

  if (offersToPost.length > 0 && webhooks.length > 0) {
    const embeds = createOfferEmbeds(offersToPost, service);

    for (const webhook of webhooks) {
      await fetch(webhook.url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ embeds }),
      });
    }
  }

  const logData = {
    offersFetched: fetchedOffers.length,
    offersPosted: offersToPost.length,
    webhooksPosted: webhooks.length,
  };

  console.log(logData);
  return logData;
}

export default postOffersHandler;
