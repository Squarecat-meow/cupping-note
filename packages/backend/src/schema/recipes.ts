import { integer, pgEnum, pgTable, serial, text } from 'drizzle-orm/pg-core'

export const grinderTypeEnum = pgEnum('grinder_type', ['manual', 'electric'])

export const recipes = pgTable('recipes', {
  id: serial('id').primaryKey(),

  name: text('name').notNull(),
  description: text('description').notNull(),
  instructions: text('instructions').notNull(),

  waterAmount: integer('water_amount').notNull(),
  beanAmount: integer('bean_amount').notNull(),

  brewTime: integer('brew_time').notNull(),
  temperature: integer('temperature').notNull(),

  grinderType: grinderTypeEnum('grinder_type').notNull(),
  grinderName: text('grinder_name'), // Optional
  grinderClicks: integer('grinder_clicks'), // Optional
})
