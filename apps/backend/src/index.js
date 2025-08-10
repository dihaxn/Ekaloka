import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import productRouter from './routes/productRoute.js';
import userRouter from './routes/userRoute.js';
import orderRouter from './routes/orderRoute.js';
import passport from 'passport';
import session from 'express-session';
import 'dotenv/config';
import './config/passport-setup.js';

// app config
const app = express();
const port = process.env.PORT || 4000;

// middlewares
app.use(express.json());
app.use(cors());
if (!process.env.SESSION_SECRET) {
  console.warn('[Session] SESSION_SECRET not set. Using insecure fallback (DO NOT use in production).');
}
app.use(session({
  secret: process.env.SESSION_SECRET || 'insecure_dev_secret_change_me',
  resave: false,
  saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());

// db connection (attempt before starting server)
const startServer = async (attempt = 0) => {
  const dbStatus = await connectDB();
  if (!dbStatus.connected) {
    if (dbStatus.reason === 'MISSING_URI') {
      console.warn('[Startup] Continuing without database. Set MONGO_URI in a .env file to enable persistence.');
    } else {
      console.error('[Startup] Database not connected (' + dbStatus.reason + '). The API may not function properly.');
    }
  }

  const server = app.listen(port, () => {
    console.log(`Server Started on http://localhost:${port}`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      if (attempt < 3) {
        const newPort = Number(port) + 1;
        console.warn(`[Startup] Port ${port} in use. Retrying on ${newPort} (attempt ${attempt + 1}).`);
        process.env.PORT = newPort;
        setTimeout(() => startServer(attempt + 1), 300);
      } else {
        console.error('[Startup] Failed to bind after multiple attempts. Exiting.');
        process.exit(1);
      }
    } else {
      console.error('[Startup] Server error:', err);
      process.exit(1);
    }
  });
};

startServer();

// api endpoints
app.use('/api/product', productRouter);
app.use('/api/user', userRouter);
app.use('/api/order', orderRouter);
app.use('/images', express.static('uploads'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

//
app.get('/', (req, res) => {
  res.send('API Working');
});

// moved server start into startServer()
