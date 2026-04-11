import mongoose from 'mongoose';

const DEFAULT_URI = 'mongodb://localhost:27017/atlas_beast';
const MAX_RETRIES = 10;
const RETRY_MS = 3000;

/**
 * Connects to MongoDB with exponential-style backoff retries.
 * Does not throw on failure after max retries — logs and allows process exit.
 */
export async function connectDatabase(uri = process.env.MONGODB_URI || DEFAULT_URI) {
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
