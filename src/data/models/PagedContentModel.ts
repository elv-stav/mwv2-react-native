import { z } from "zod";

export function PagedContentSchema<Content extends z.ZodTypeAny>(contentSchema: Content) {
  return z.object({
    contents: z.array(contentSchema),
    paging: z.object({
      start: z.number(),
      limit: z.number(),
      total: z.number(),
    }),
  });
}
