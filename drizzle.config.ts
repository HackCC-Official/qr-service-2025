require('dotenv').config({ 
  path: ['.env.local', '.env'] 
})
import type { Config } from 'drizzle-kit';

const { DATABASE_HOST, DATABASE_PORT, DATABASE_USER, DATABASE_PASSWORD, DATABASE_DB } = process.env
export default {
  out: './drizzle',
  schema: './src/drizzle/schema',
  dialect: 'postgresql',
  dbCredentials: {
    url: `postgres://${DATABASE_USER}:${DATABASE_PASSWORD}@${DATABASE_HOST}:${DATABASE_PORT}/${DATABASE_DB}`
  },
} satisfies Config