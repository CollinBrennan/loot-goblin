import { PutCommand } from '@aws-sdk/lib-dynamodb';
import db from '.';
import type { InsertOffer } from './schema';

const OFFER_TABLE_NAME = 'offer';

export async function tryPutOffer(offer: InsertOffer) {
  await db.send(
    new PutCommand({
      TableName: OFFER_TABLE_NAME,
      Item: offer,
      ConditionExpression: 'attribute_not_exists(offerId)',
    }),
  );
}
