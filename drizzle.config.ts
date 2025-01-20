require('dotenv').config({ 
  path: ['.env.local', '.env'] 
})
import type { Config } from 'drizzle-kit';

console.log('Database Config:', {
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_DB,
});

const { DATABASE_HOST, DATABASE_PORT, DATABASE_USER, DATABASE_PASSWORD, DATABASE_DB } = process.env
export default {
  out: './drizzle',
  schema: './src/drizzle/schema',
  dialect: 'postgresql',
  dbCredentials: {
    url: `postgres://${DATABASE_USER}:${DATABASE_PASSWORD}@${DATABASE_HOST}:${DATABASE_PORT}/${DATABASE_DB}`
  },
} satisfies Config