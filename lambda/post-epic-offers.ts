import { fetchEpicOffers } from '../api/epic';
import { epic } from '../services';
import postOffersHandler from '../utils/post-offers-handler';

const handler = async () => await postOffersHandler(fetchEpicOffers, epic);

export { handler };
