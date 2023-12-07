import { z } from 'zod';

const createOrUpdateGroupSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: 'Name is required',
    }),
  }),
});

export { createOrUpdateGroupSchema };
