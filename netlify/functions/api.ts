
import { Handler } from '@netlify/functions';
import serverless from 'serverless-http';
import express from 'express';
import session from 'express-session';
import MemoryStore from 'memorystore';
import passport from 'passport';
import { fileURLToPath } from 'url';
import path from 'path';

// Import routes dan file-file server lainnya
import { router } from '../../server/routes';

const app = express();
const MemoryStoreSession = MemoryStore(session);

// Konfigurasi session
app.use(
  session({
    cookie: {
      maxAge: 86400000, // 24 jam
    },
    store: new MemoryStoreSession({
      checkPeriod: 86400000,
    }),
    resave: false,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET || 'development-secret',
  })
);

// Konfigurasi passport
app.use(passport.initialize());
app.use(passport.session());

// Parse JSON body
app.use(express.json());

// Gunakan router API
app.use('/api', router);

// Penanganan 404 untuk API
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// Ekspor handler serverless
const handler: Handler = serverless(app);
export { handler };
