import { z } from 'zod';

const secretFriendGroupSchema = z.object({
  body: z.object({
    groupId: z.string({
      required_error: 'GroupIs is required',
    }),
    participants: z
      .array(z.string())
      .optional()
      .transform((userId) => userId ?? []),
  }),
});

const secretFriendGroupAddParticipantSchema = z.object({
  body: z.object({
    participants: z.array(z.string()).nonempty({
      message: 'Atleast one participant is required',
    }),
  }),
});

export { secretFriendGroupSchema, secretFriendGroupAddParticipantSchema };
