import { randomUUID } from "node:crypto";
import { TodoItem } from "@upstart.samuelmasse.com/common";

export class TodoDb {
  private readonly items = new Map<string, TodoItem>();

  list(): TodoItem[] {
    return [...this.items.values()].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  }

  get(id: string): TodoItem | undefined {
    return this.items.get(id);
  }

  create(data: { title: string; description?: string }): TodoItem {
    const now = new Date().toISOString();

    const item: TodoItem = {
      id: randomUUID(),
      title: data.title,
      description: data.description,
      done: false,
      createdAt: now,
      updatedAt: now,
    };

    this.items.set(item.id, item);
    return item;
  }

  update(id: string, patch: Partial<TodoItem>): TodoItem | undefined {
    const cur = this.items.get(id);
    if (!cur) return undefined;

    const next: TodoItem = {
      ...cur,
      ...patch,
      updatedAt: new Date().toISOString(),
    };

    this.items.set(id, next);
    return next;
  }

  remove(id: string): boolean {
    return this.items.delete(id);
  }
}
