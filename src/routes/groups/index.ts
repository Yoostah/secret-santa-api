import { Router, Request, Response } from 'express';

import crypto from 'crypto';

import { Group, GroupStatus } from '../../models/group';
import { createOrUpdateGroupSchema } from './_schema';
import schemaValidation from '../../middlewares/schemaValidation';

const router = Router();

let groups: Group[] = [
  {
    id: 'e8d3dfaa5ccbf759166df5183ba1c826',
    name: 'Natal 2023',
    status: 'preparation' as GroupStatus,
  },
  {
    id: '0c837885-28b6-4294-9ed2-b8ea2f450e39',
    name: 'Ano Novo 2023',
    status: 'preparation' as GroupStatus,
  },
  {
    id: 'e6a319c8-0d48-4974-9e58-a5dac7a86c05',
    name: 'Pascoa 2024',
    status: 'preparation' as GroupStatus,
  },
];

router.post('/groups', schemaValidation(createOrUpdateGroupSchema), (req: Request, res: Response) => {
  const uuid = crypto.randomBytes(16).toString('hex');

  const data = res.locals.valid;

  const group: Group = {
    id: uuid,
    name: data.body.name,
    status: GroupStatus.PREPARATION,
  };

  groups.push(group);
  res.status(201).json(group);
});

router.get('/groups', (req: Request, res: Response) => {
  const activeGroups = groups.filter((group) => ![GroupStatus.DELETED, GroupStatus.FINISHED].includes(group.status));

  res.status(200).json(activeGroups);
});

router.get('/groups/:id', (req: Request, res: Response) => {
  const group = groups.find((group) => group.id === req.params.id);
  if (group) {
    res.status(200).json(group);
  } else {
    res.status(404).send();
  }
});

router.put('/groups/:id', schemaValidation(createOrUpdateGroupSchema), (req: Request, res: Response) => {
  const groupIndex = groups.findIndex((group) => group.id === req.params.id);

  if (groupIndex >= 0) {
    const data = res.locals.valid;

    groups[groupIndex] = {
      ...groups[groupIndex],
      ...data.body,
    };

    res.status(200).json(groups[groupIndex]);
  } else {
    res.status(404).send();
  }
});

router.delete('/groups/:id', (req: Request, res: Response) => {
  const groupIndex = groups.findIndex((group) => group.id === req.params.id && group.status === GroupStatus.PREPARATION);

  if (groupIndex >= 0) {
    groups[groupIndex].status = GroupStatus.DELETED;
    res.status(200).json(groups[groupIndex]);
  } else {
    res.status(404).send();
  }
});

router.patch('/groups/:id/finish', (req: Request, res: Response) => {
  const groupIndex = groups.findIndex((group) => group.id === req.params.id && group.status === GroupStatus.PREPARATION);

  if (groupIndex >= 0) {
    groups[groupIndex].status = GroupStatus.FINISHED;
    res.status(200).json(groups[groupIndex]);
  } else {
    res.status(404).send();
  }
});

router.patch('/groups/:id/start', (req: Request, res: Response) => {
  const groupIndex = groups.findIndex((group) => group.id === req.params.id && group.status === GroupStatus.PREPARATION);

  if (groupIndex >= 0) {
    groups[groupIndex].status = GroupStatus.ACTIVE;
    res.status(200).json(groups[groupIndex]);
  } else {
    res.status(404).send();
  }
});

export default router;
