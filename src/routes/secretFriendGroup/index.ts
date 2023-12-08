import { Router, Request, Response } from 'express';

import schemaValidation from '../../middlewares/schemaValidation';
import { SecretFriendGroup } from '../../models/secretFriendGroup';
import { secretFriendGroupAddParticipantSchema, secretFriendGroupSchema } from './_schema';

const router = Router();

let groups: SecretFriendGroup[] = [
  {
    groupId: 'e8d3dfaa5ccbf759166df5183ba1c826',
    participants: [
      'f98e61e7862a22b3448ee6e3dcb4949f',
      'ca15ca84-55e3-43a5-98e9-cd84e8eaaab2',
      '374784cc-cb47-4ab2-91ad-25fafd8e7ef8',
    ],
  },
  {
    groupId: '0c837885-28b6-4294-9ed2-b8ea2f450e39',
    participants: [],
  },
  {
    groupId: 'e6a319c8-0d48-4974-9e58-a5dac7a86c05',
    participants: ['374784cc-cb47-4ab2-91ad-25fafd8e7ef8', '571f675b-62e8-42bb-9afc-94c1f0df6578'],
  },
];

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

router.put(
  '/secret-friend-group/:groupId/create-combinations',

  (req: Request, res: Response) => {
    const groupIndex = groups.findIndex((group) => group.groupId === req.params.groupId);

    if (groupIndex >= 0) {
      const availableParticipants = [...groups[groupIndex].participants];

      const draw = (): SecretFriendGroup['combinations'] => {
        delete groups[groupIndex]?.combinations;
        const combinations: SecretFriendGroup['combinations'] = [];

        groups[groupIndex].participants.forEach((participantId) => {
          let receiver;

          do {
            receiver = availableParticipants[Math.floor(Math.random() * availableParticipants.length)];

            if (availableParticipants.length === 1 && receiver === participantId) {
              console.error(`\x1b[101mReseting Draw !!!\x1b[0m`);
              draw();
              return;
            }
          } while (participantId === receiver);

          availableParticipants.splice(availableParticipants.indexOf(receiver), 1);

          combinations.push({
            giver: {
              id: participantId,
              name: 'DOADOR',
            },
            receiver: {
              id: receiver,
              name: 'RECEBEDOR',
            },
          });
        });
        return combinations;
      };

      groups[groupIndex].combinations = draw();

      console.warn(`\x1b[33mDraw for group \x1b[0m${groups[groupIndex].groupId}\x1b[33m finished!\x1b[0m`);

      res.status(200).json(groups[groupIndex]);
    } else {
      res.status(404).send();
    }
  }
);
export default router;
