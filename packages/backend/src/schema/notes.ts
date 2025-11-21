import { integer, pgTable, serial, text } from 'drizzle-orm/pg-core'
import { beans } from './beans.js'
import { recipes } from './recipes.js'

export const notes = pgTable('notes', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  recipe: integer('recipe')
    .notNull()
    .references(() => recipes.id),
  bean: integer('bean')
    .notNull()
    .references(() => beans.id),
})
