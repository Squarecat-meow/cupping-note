import { pgEnum, pgTable, serial, text } from 'drizzle-orm/pg-core'

export const roastLevelEnum = pgEnum('roast_level', ['light', 'medium', 'medium_dark', 'dark'])

export const beans = pgTable('beans', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  origin: text('origin').notNull(),
  variety: text('variety').notNull(),
  roastLevel: roastLevelEnum('roast_level').notNull(),
})
