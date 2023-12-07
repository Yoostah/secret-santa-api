import { Router, Request, Response } from 'express';

import crypto from 'crypto';

import { Group, GroupStatus } from '../../models/group';
import { createOrUpdateGroupSchema } from './_schema';
import schemaValidation from '../../middlewares/schemaValidation';

const router = Router();

let groups: Group[] = [];

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

export default router;
