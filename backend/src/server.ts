import { TodoApi } from "./todo-api";
import { TodoDb } from "./todo-db";

export class Server {
  public todoApi: TodoApi;

  constructor() {
    const todoDb = new TodoDb();

    this.todoApi = new TodoApi(todoDb);
  }
}
