import { randomUUID } from "node:crypto";
import { Item, ItemCreate, ItemUpdate } from "@upstart.samuelmasse.com/common";

export class ItemsStore {
  private readonly items = new Map<string, Item>();

  list(): Item[] {
    return [...this.items.values()].sort((a, b) =>
      a.createdAt < b.createdAt ? 1 : -1,
    );
  }

  get(id: string): Item | null {
    return this.items.get(id) ?? null;
  }

  create(data: ItemCreate): Item {
    const now = new Date().toISOString();

    const item: Item = {
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

  update(id: string, patch: ItemUpdate): Item | null {
    const cur = this.items.get(id);
    if (!cur) return null;

    const next: Item = {
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
