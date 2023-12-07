import express from 'express';

import userRoutes from './routes/users';
import groupRoutes from './routes/groups';
import secretFriendGroupRoutes from './routes/secretFriendGroup';

const server = express();
const PORT = process.env.SERVER_PORT || 5000;

server.use(express.json());

server.use('/api', [userRoutes, groupRoutes, secretFriendGroupRoutes]);

const startServer = (): void => {
  try {
    server.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};
startServer();
