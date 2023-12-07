import { z } from 'zod';

const createUserSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: 'Name is required',
    }),
    email: z
      .string({
        required_error: 'Email is required',
      })
      .email('Not a valid email'),
    password: z
      .string({
        required_error: 'Password is required',
      })
      .min(6, 'Password must be at least 6 characters'),
  }),
});

const updateUserSchema = z.object({
  body: z.object({
    name: z
      .string({
        required_error: 'Name is required',
      })
      .optional(),
    email: z
      .string({
        required_error: 'Email is required',
      })
      .email('Not a valid email')
      .optional(),
    password: z
      .string({
        required_error: 'Password is required',
      })
      .min(6, 'Password must be at least 6 characters')
      .optional(),
  }),
});

export { createUserSchema, updateUserSchema };
