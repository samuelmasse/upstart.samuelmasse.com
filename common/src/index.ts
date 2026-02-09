import z from "zod";

export const ItemCreateSchema = z.object({
  title: z.string().min(1),
  description: z.string().max(500).optional(),
});

export const ItemUpdateSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().max(500).optional(),
  done: z.boolean().optional(),
});

export type ItemCreate = z.infer<typeof ItemCreateSchema>;
export type ItemUpdate = z.infer<typeof ItemUpdateSchema>;

export const ItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  done: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Item = z.infer<typeof ItemSchema>;
