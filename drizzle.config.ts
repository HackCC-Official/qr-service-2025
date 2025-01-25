require('dotenv').config({ 
  path: ['.env.local', '.env'] 
})
import type { Config } from 'drizzle-kit';

const { DATABASE_EXTERNAL_HOST, DATABASE_EXTERNAL_PORT, DATABASE_USER, DATABASE_PASSWORD, DATABASE_DB } = process.env
export default {
  out: './drizzle',
  schema: './src/drizzle/schema',
  dialect: 'postgresql',
  dbCredentials: {
    url: `postgres://${DATABASE_USER}:${DATABASE_PASSWORD}@${DATABASE_EXTERNAL_HOST}:${DATABASE_EXTERNAL_PORT}/${DATABASE_DB}`
  },
} satisfies Config