import mongoose from 'mongoose';

const MAX_RETRIES = 10;
const RETRY_MS = 3000;

/**
 * Connects to MongoDB using MONGO_URI from the environment.
 * Retries on failure; exits if MONGO_URI is missing or max retries are reached.
 */
export async function connectDatabase() {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    console.error('[ATLAS DB] MONGO_URI environment variable is not set.');
    process.exit(1);
  }

  let attempt = 0;

  while (attempt < MAX_RETRIES) {
    try {
      await mongoose.connect(uri);
      console.log('[ATLAS DB] Connected to MongoDB');
      mongoose.connection.on('disconnected', () => {
        console.warn('[ATLAS DB] Disconnected');
      });
      mongoose.connection.on('error', (err) => {
        console.error('[ATLAS DB] Connection error:', err.message);
      });
      return;
    } catch (err) {
      attempt += 1;
      console.error(
        `[ATLAS DB] Connect attempt ${attempt}/${MAX_RETRIES} failed:`,
        err.message
      );
      if (attempt >= MAX_RETRIES) {
        console.error('[ATLAS DB] Max retries reached. Exiting.');
        process.exit(1);
      }
      await new Promise((r) => setTimeout(r, RETRY_MS));
    }
  }
}
