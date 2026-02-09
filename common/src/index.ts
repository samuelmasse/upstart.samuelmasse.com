import z from "zod";

function route(method: string, sub: string) {
  return {
    method,
    target: `/api/v1${sub}`,
  };
}

export const TodoItemSchema = z.object({
  userId: z.string(),
  todoId: z.string(),
  title: z.string(),
  description: z.string().optional(),
  done: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const Schema = {
  createTodo: {
    route: route("POST", "/todos"),
    req: z.object({
      title: z.string(),
      description: z.string().optional(),
    }),
    res: z.object({ item: TodoItemSchema }),
  },
  getTodo: {
    route: route("GET", "/todos/:id"),
    req: z.object({ id: z.string() }),
    res: z.object({ item: TodoItemSchema.optional() }),
  },
  listTodos: {
    route: route("GET", "/todos"),
    req: z.object({ page: z.coerce.number(), rank: z.coerce.number() }),
    res: z.object({ items: z.array(TodoItemSchema) }),
  },
  deleteTodo: {
    route: route("DELETE", "/todos/:id"),
    req: z.object({ id: z.string() }),
    res: z.object({ deleted: z.boolean() }),
  },
  putTodo: {
    route: route("PUT", "/todos/:id"),
    req: z.object({ id: z.string(), item: TodoItemSchema.partial() }),
    res: z.object({ item: TodoItemSchema.optional() }),
  },
};

export type RouteSchema = { route: { method: string; target: string }; req: z.ZodObject; res: z.ZodObject };

export type TodoItem = z.infer<typeof TodoItemSchema>;

export type CreateTodoRequest = z.infer<typeof Schema.createTodo.req>;
export type CreateTodoResponse = z.infer<typeof Schema.createTodo.res>;

export type GetTodoRequest = z.infer<typeof Schema.getTodo.req>;
export type GetTodoResponse = z.infer<typeof Schema.getTodo.res>;

export type ListTodosRequest = z.infer<typeof Schema.listTodos.req>;
export type ListTodosResponse = z.infer<typeof Schema.listTodos.res>;

export type DeleteTodoRequest = z.infer<typeof Schema.deleteTodo.req>;
export type DeleteTodoResponse = z.infer<typeof Schema.deleteTodo.res>;

export type PutTodoRequest = z.infer<typeof Schema.putTodo.req>;
export type PutTodoResponse = z.infer<typeof Schema.putTodo.res>;
