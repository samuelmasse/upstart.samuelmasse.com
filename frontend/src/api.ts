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
  RouteSchema,
  Schema,
} from "@upstart.samuelmasse.com/common";

export const api = {
  createTodo: wrap<CreateTodoRequest, CreateTodoResponse>(Schema.createTodo),
  getTodo: wrap<GetTodoRequest, GetTodoResponse>(Schema.getTodo),
  listTodos: wrap<ListTodosRequest, ListTodosResponse>(Schema.listTodos),
  deleteTodo: wrap<DeleteTodoRequest, DeleteTodoResponse>(Schema.deleteTodo),
  putTodo: wrap<PutTodoRequest, PutTodoResponse>(Schema.putTodo),
};

function wrap<Req, Res>(schema: RouteSchema) {
  const params = [...schema.route.target.matchAll(/:([^/]+)/g)].map((m) => m[1]);

  return async (req: Req): Promise<Res> => {
    const reqRecord = req as Record<string, string>;
    const body = { ...reqRecord };
    let target = schema.route.target;

    for (const param of params) {
      delete body[param];
      target = target.replace(`:${param}`, reqRecord[param]);
    }

    const isGet = schema.route.method === "GET";

    if (isGet) {
      const sp = new URLSearchParams();

      Object.entries(body).forEach(([k, v]) => {
        sp.set(k, `${v}`);
      });

      const spString = sp.toString();
      if (spString.length) {
        target = `${target}?${spString}`;
      }
    }

    console.log(target);

    const res = await fetch(target, {
      method: schema.route.method,
      headers: { "Content-Type": "application/json" },
      body: isGet ? undefined : JSON.stringify(req),
    });

    if (!res.ok) {
      throw new Error(`Failed: ${res.statusText}`);
    }

    return res.json();
  };
}
