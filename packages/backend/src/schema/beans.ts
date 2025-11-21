import { pgTable, serial, text } from 'drizzle-orm/pg-core'

export const beans = pgTable('beans', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  origin: text('origin').notNull(),
  variety: text('variety').notNull(),
  roastLevel: text('roast_level').notNull(),
})
