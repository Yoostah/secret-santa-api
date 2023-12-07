import { Router, Request, Response } from 'express';
import { User, UserStatus } from '../../models/user';
import crypto from 'crypto';
import schemaValidation from '../../middlewares/schemaValidation';
import { createUserSchema, updateUserSchema } from './_schema';

const router = Router();

let users: User[] = [];

router.post('/users', schemaValidation(createUserSchema), (req: Request, res: Response) => {
  const uuid = crypto.randomBytes(16).toString('hex');

  const data = res.locals.valid;

  const user: User = {
    id: uuid,
    name: data.body.name,
    email: data.body.email,
    password: data.body.password,
    status: UserStatus.ACTIVE,
  };

  users.push(user);
  res.status(201).json(user);
});

router.get('/users', (req: Request, res: Response) => {
  const activeUsers = users.filter((user) => user.status === UserStatus.ACTIVE);

  res.status(200).json(activeUsers);
});

router.get('/users/:id', (req: Request, res: Response) => {
  const user = users.find((user) => user.id === req.params.id);
  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404).send();
  }
});

router.put('/users/:id', schemaValidation(updateUserSchema), (req: Request, res: Response) => {
  const userIndex = users.findIndex((user) => user.id === req.params.id);

  if (userIndex >= 0) {
    const data = res.locals.valid;

    users[userIndex] = {
      ...users[userIndex],
      ...data.body,
    };

    res.status(200).json(users[userIndex]);
  } else {
    res.status(404).send();
  }
});

router.delete('/users/:id', (req: Request, res: Response) => {
  const userIndex = users.findIndex((user) => user.id === req.params.id && user.status === UserStatus.ACTIVE);

  if (userIndex >= 0) {
    users[userIndex].status = UserStatus.INACTIVE;
  }

  res.status(204).send();
});

export default router;
