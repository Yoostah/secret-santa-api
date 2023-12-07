import { Router, Request, Response } from 'express';

import schemaValidation from '../../middlewares/schemaValidation';
import { SecretFriendGroup } from '../../models/secretFriendGroup';
import { secretFriendGroupAddParticipantSchema, secretFriendGroupSchema } from './_schema';

const router = Router();

let groups: SecretFriendGroup[] = [];

router.post('/secret-friend-group', schemaValidation(secretFriendGroupSchema), (req: Request, res: Response) => {
  const data = res.locals.valid;

  const group: SecretFriendGroup = {
    groupId: data.body.groupId,
    participants: data.body.participants,
  };

  groups.push(group);
  res.status(201).json(group);
});

router.get('/secret-friend-group', (req: Request, res: Response) => {
  res.status(200).json(groups);
});

router.patch(
  '/secret-friend-group/:groupId/add-participant',
  schemaValidation(secretFriendGroupAddParticipantSchema),
  (req: Request, res: Response) => {
    const data = res.locals.valid;

    const groupIndex = groups.findIndex((group) => group.groupId === req.params.groupId);

    if (groupIndex >= 0) {
      groups[groupIndex] = {
        ...groups[groupIndex],
        participants: [...new Set([...groups[groupIndex].participants, ...data.body.participants])],
      };

      res.status(200).json(groups[groupIndex]);
    } else {
      res.status(404).send();
    }
  }
);
export default router;
