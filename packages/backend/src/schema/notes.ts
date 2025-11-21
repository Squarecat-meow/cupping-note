import { pgTable, serial, text } from 'drizzle-orm/pg-core'

export const notes = pgTable('notes', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
})
