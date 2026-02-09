import { Schema } from "@upstart.samuelmasse.com/common";
import { Routes } from "./routes";
import { Server } from "./server";

export class Api {
  constructor(server: Server, routes: Routes) {
    routes.add(Schema.createTodo, server.todoApi.createTodo.bind(server.todoApi));
    routes.add(Schema.getTodo, server.todoApi.getTodo.bind(server.todoApi));
    routes.add(Schema.listTodos, server.todoApi.listTodos.bind(server.todoApi));
    routes.add(Schema.deleteTodo, server.todoApi.deleteTodo.bind(server.todoApi));
    routes.add(Schema.putTodo, server.todoApi.putTodo.bind(server.todoApi));
  }
}
