import 'dotenv/config';
import app from './app.js';
import { connectDatabase } from './config/db.js';

const PORT = process.env.PORT || 5000;

async function bootstrap() {
  await connectDatabase();
  app.listen(PORT, () => {
    console.log(`[ATLAS API] Listening on port ${PORT}`);
  });
}

bootstrap().catch((err) => {
  console.error('[ATLAS] Bootstrap failed:', err);
  process.exit(1);
});
