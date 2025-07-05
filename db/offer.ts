import { PutItemCommand } from '@aws-sdk/client-dynamodb';
import db from '.';
import type { Offer } from './schema';

export async function putOffer({
  offerId,
  service,
  ttl,
}: Offer): Promise<void> {
  await db.send(
    new PutItemCommand({
      TableName: 'offer',
      Item: {
        offerId: { S: offerId },
        service: { S: service },
        ttl: { N: ttl.toString() },
      },
      ConditionExpression: 'attribute_not_exists(offerId)',
    }),
  );
}
