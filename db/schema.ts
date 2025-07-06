export type InsertOffer = {
  offerId: string;
  serviceId: string;
  ttl: number;
};

export type InsertWebhook = {
  webhookId: string;
  serviceId: string;
  url: string;
};

export type SelectWebhook = {
  webhookId: string;
  serviceId: string;
  url: string;
};
