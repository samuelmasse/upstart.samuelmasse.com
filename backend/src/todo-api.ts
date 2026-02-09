import {
  CreateTodoRequest,
  CreateTodoResponse,
  DeleteTodoRequest,
  DeleteTodoResponse,
  GetTodoRequest,
  GetTodoResponse,
  ListTodosRequest,
  ListTodosResponse,
  PutTodoRequest,
  PutTodoResponse,
} from "@upstart.samuelmasse.com/common";
import { TodoDb } from "./todo-db";
import { Req, Res } from "./types";

export class TodoApi {
  constructor(private todoDb: TodoDb) {}

  public async createTodo(req: Req<CreateTodoRequest>): Promise<Res<CreateTodoResponse>> {
    const item = await this.todoDb.create({
      userId: req.userId,
      title: req.body.title,
      description: req.body.description,
    });

    return { body: { item }, status: 201 };
  }

  public async getTodo(req: Req<GetTodoRequest>): Promise<Res<GetTodoResponse>> {
    const item = await this.todoDb.get(req.userId, req.body.id);

    return { body: { item } };
  }

  public async listTodos(req: Req<ListTodosRequest>): Promise<Res<ListTodosResponse>> {
    const items = await this.todoDb.list(req.userId);

    return { body: { items } };
  }

  public async deleteTodo(req: Req<DeleteTodoRequest>): Promise<Res<DeleteTodoResponse>> {
    const deleted = await this.todoDb.remove(req.userId, req.body.id);

    return { body: { deleted } };
  }

  public async putTodo(req: Req<PutTodoRequest>): Promise<Res<PutTodoResponse>> {
    const item = await this.todoDb.update(req.userId, req.body.id, req.body.item);

    return { body: { item } };
  }
}
