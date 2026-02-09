import { randomUUID } from "node:crypto";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import { TodoItem } from "@upstart.samuelmasse.com/common";

export class TodoDb {
  private readonly tableName = "UpstartTodos";

  constructor(private ddb: DynamoDBDocument) {}

  async list(userId: string): Promise<TodoItem[]> {
    const result = await this.ddb.query({
      TableName: this.tableName,
      KeyConditionExpression: "userId = :userId",
      ExpressionAttributeValues: { ":userId": userId },
    });

    const items = (result.Items || []) as TodoItem[];
    return items.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  }

  async get(userId: string, todoId: string): Promise<TodoItem | undefined> {
    const result = await this.ddb.get({
      TableName: this.tableName,
      Key: { userId, todoId },
    });

    return result.Item as TodoItem | undefined;
  }

  async create(data: { userId: string; title: string; description?: string }): Promise<TodoItem> {
    const now = new Date().toISOString();

    const item: TodoItem = {
      userId: data.userId,
      todoId: randomUUID(),
      title: data.title,
      description: data.description,
      done: false,
      createdAt: now,
      updatedAt: now,
    };

    await this.ddb.put({
      TableName: this.tableName,
      Item: item,
    });

    return item;
  }

  async update(userId: string, todoId: string, patch: Partial<TodoItem>): Promise<TodoItem | undefined> {
    const cur = await this.get(userId, todoId);
    if (!cur) {
      return undefined;
    }

    const next: TodoItem = {
      ...cur,
      ...patch,
      updatedAt: new Date().toISOString(),
    };

    await this.ddb.put({
      TableName: this.tableName,
      Item: next,
    });

    return next;
  }

  async remove(userId: string, todoId: string): Promise<boolean> {
    const item = await this.get(userId, todoId);
    if (!item) {
      return false;
    }

    await this.ddb.delete({
      TableName: this.tableName,
      Key: { userId, todoId },
    });

    return true;
  }
}
