export type Offer = {
  id: string;
  title: string;
  endDate: Date;
  imageUrl: string;
  storeUrl: string;
  originalPrice?: string;
};

export type Service = {
  id: string;
  name: string;
  thumbnail: string;
};
