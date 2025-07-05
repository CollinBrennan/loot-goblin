export type Game = {
  offerId: string;
  title: string;
  endDate: Date;
  imageUrl: string;
  storeUrl: string;
  originalPrice?: string;
};

export type Service = {
  name: string;
  displayName: string;
  thumbnail: string;
};
