import 'dotenv/config';
import { config, createSchema } from '@keystone-next/keystone/schema';
import { User } from './schemas/User';
import { createAuth } from '@keystone-next/auth';
import { Product } from './schemas/Product';
import {
  withItemData,
  statelessSessions,
} from '@keystone-next/keystone/session';

const databaseURL = process.env.DATABASE_URL;

const sessionConfig = {
  maxAge: 60 * 60 * 24 * 360, // How long they stay signed in
  secret: process.env.COOKIE_SECRET,
};

const { withAuth } = createAuth({
  listKey: 'User',
  identityField: 'email',
  secretField: 'password',
  initFirstItem: {
    fields: ['name', 'email', 'password'],
  },
});

export default withAuth(
  config({
    server: {
      cors: {
        origin: [process.env.FRONTEND_URL],
        credentials: true,
      },
    },
    db: {
      adapter: 'mongoose',
      url: databaseURL,
      // TODO: Add data seeding here
    },
    lists: createSchema({ User, Product }),
    ui: {
      // Show the UI only for people who pass this test
      isAccessAllowed: ({ session }) => {
        console.log('🚀 ~ file: keystone.ts ~ line 43 ~ session', session.data);
        return !!session?.data;
      },
    },
    session: withItemData(statelessSessions(sessionConfig), {
      User: 'id name',
    }),
  })
);
