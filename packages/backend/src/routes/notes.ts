import { createRoute, type OpenAPIHono } from '@hono/zod-openapi'
import { z } from 'zod'
import { db } from '../db.js'
import { notes } from '../schema/notes.js'

const notesRoute = createRoute({
  method: 'get',
  path: '/notes',
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.array(
            z.object({
              id: z.number(),
              name: z.string(),
            }),
          ),
        },
      },
      description: '노트 목록 조회',
    },
  },
})

export default (app: OpenAPIHono) => app.openapi(notesRoute, async (c) => c.json(await db.select().from(notes)))
