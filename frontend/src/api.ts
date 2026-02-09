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
    const body = schema.req.parse(req) as Record<string, unknown>;
    let target = schema.route.target;

    for (const param of params) {
      target = target.replace(`:${param}`, `${body[param]}`);
      delete body[param];
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

    const fullReq = {
      method: schema.route.method,
      headers: { "Content-Type": "application/json", Authorization: `${localStorage.getItem("fakeUser")}` },
      body: isGet ? undefined : JSON.stringify(body),
    };

    console.log("->", fullReq.method, target, fullReq);
    const res = await fetch(target, fullReq);

    if (!res.ok) {
      throw new Error(`Failed: ${res.statusText}`);
    }

    const json = await res.json();
    const resParsed = schema.res.parse(json) as Res;
    console.log("<-", fullReq.method, target, resParsed);
    return resParsed;
  };
}
