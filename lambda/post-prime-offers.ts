import { fetchPrimeOffers } from '../api/prime';
import { prime } from '../services';
import postOffersHandler from '../utils/post-offers-handler';

const handler = async () => await postOffersHandler(fetchPrimeOffers, prime);

export { handler };
