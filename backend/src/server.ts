import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import { TodoApi } from "./todo-api";
import { TodoDb } from "./todo-db";

export class Server {
  public todoApi: TodoApi;

  constructor() {
    const ddb = DynamoDBDocument.from(new DynamoDB({ region: "ca-west-1" }));
    const todoDb = new TodoDb(ddb);

    this.todoApi = new TodoApi(todoDb);
  }
}
