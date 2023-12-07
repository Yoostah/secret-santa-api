import { Router, Request, Response } from 'express';
import { User, UserStatus } from '../models/user';
import crypto from 'crypto';
import validateSchema from '../middlewares/schemaValidation';
import { createUserSchema, updateUserSchema } from './users/schema';

const router = Router();

let users: User[] = [];

router.post('/users', validateSchema(createUserSchema), (req: Request, res: Response) => {
  const uuid = crypto.randomBytes(16).toString('hex');

  const user: User = {
    id: uuid,
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
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

router.put('/users/:id', validateSchema(updateUserSchema), (req: Request, res: Response) => {
  const userIndex = users.findIndex((user) => user.id === req.params.id);

  if (userIndex >= 0) {
    users[userIndex] = {
      ...users[userIndex],
      ...req.body,
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
