import { PutCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
import db from '.';
import type { InsertWebhook, SelectWebhook } from './schema';

const WEBHOOK_TABLE_NAME = 'webhook';

export async function putWebhook(webhook: InsertWebhook) {
  await db.send(
    new PutCommand({
      TableName: WEBHOOK_TABLE_NAME,
      Item: webhook,
    }),
  );
}

export async function getWebhooksByService(
  serviceId: string,
): Promise<SelectWebhook[]> {
  const command = new QueryCommand({
    TableName: WEBHOOK_TABLE_NAME,
    IndexName: 'serviceId-webhookId-index',
    KeyConditionExpression: 'serviceId = :s',
    ExpressionAttributeValues: {
      ':s': serviceId,
    },
  });

  const result = await db.send(command);

  return (result.Items ?? []) as SelectWebhook[];
}
