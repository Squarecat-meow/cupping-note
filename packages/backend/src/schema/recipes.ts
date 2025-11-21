
import { pgTable, serial, text } from 'drizzle-orm/pg-core'

export const recipes = pgTable('recipes', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
})
