import { Router, Request, Response } from 'express';
import { User, UserStatus } from '../../models/user';
import crypto from 'crypto';
import schemaValidation from '../../middlewares/schemaValidation';
import { createUserSchema, updateUserSchema } from './_schema';

const router = Router();

let users: User[] = [
  {
    id: 'f98e61e7862a22b3448ee6e3dcb4949f',
    name: 'Fredrick Mayer',
    email: 'roslyn.hegmann41@example.org',
    password: '123456',
    status: 'active' as UserStatus,
  },
  {
    id: 'ca15ca84-55e3-43a5-98e9-cd84e8eaaab2',
    name: 'Horace Bergnaum',
    email: 'amely_lynch@gmail.com',
    password: '123456',
    status: 'active' as UserStatus,
  },
  {
    id: '374784cc-cb47-4ab2-91ad-25fafd8e7ef8',
    name: 'Kay Romaguera',
    email: 'ervin_kihn37@yahoo.com',
    password: '123456',
    status: 'active' as UserStatus,
  },
  {
    id: '571f675b-62e8-42bb-9afc-94c1f0df6578',
    name: 'Kristopher Kirlin',
    email: 'rhianna.hegmann@yahoo.com',
    password: '123456',
    status: 'active' as UserStatus,
  },
  {
    id: 'b3a5581b-7bc6-4631-b6ed-dcedb2e1449b',
    name: 'James Franecki',
    email: 'pinkie.beatty57@hotmail.com',
    password: '123456',
    status: 'active' as UserStatus,
  },
  {
    id: '8b1da3e5-07d5-4348-af3d-c4b54c7950d1',
    name: "Michele D'Amore II",
    email: 'kamron_ernser@yahoo.com',
    password: '123456',
    status: 'active' as UserStatus,
  },
];

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
