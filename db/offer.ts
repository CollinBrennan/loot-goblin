import { PutItemCommand } from '@aws-sdk/client-dynamodb';
import db from '.';
import type { InsertOffer } from './schema';

export async function tryPutOffer({
  offerId,
  serviceId,
  ttl,
}: InsertOffer): Promise<void> {
  await db.send(
    new PutItemCommand({
      TableName: 'offer',
      Item: {
        offerId: { S: offerId },
        serviceId: { S: serviceId },
        ttl: { N: ttl.toString() },
      },
      ConditionExpression: 'attribute_not_exists(offerId)',
    }),
  );
}
