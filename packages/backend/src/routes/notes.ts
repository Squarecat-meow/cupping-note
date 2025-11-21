import { createRoute, type OpenAPIHono } from '@hono/zod-openapi'
import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '../db.js'
import { notes } from '../schema/notes.js'

const getNotesRoute = createRoute({
  method: 'get',
  path: '/notes',
  tags: ['Notes'],
  summary: '노트 목록 조회',
  responses: {
    200: {
      description: '노트 목록 조회 성공',
      content: {
        'application/json': {
          schema: z.array(
            z.object({
              id: z.number().openapi({ description: '노트 ID' }),
              name: z.string().openapi({ description: '노트 이름' }),
              recipe: z.number().openapi({ description: '레시피 ID' }),
              bean: z.number().openapi({ description: '원두 ID' }),
              content: z.string().openapi({ description: '노트 내용' }),
            }),
          ),
        },
      },
    },
  },
})

const createNoteRoute = createRoute({
  method: 'post',
  path: '/notes',
  tags: ['Notes'],
  summary: '노트 생성',
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.object({
            name: z.string().openapi({ description: '노트 이름' }),
            recipe: z.number().openapi({ description: '레시피 ID' }),
            bean: z.number().openapi({ description: '원두 ID' }),
            content: z.string().openapi({ description: '노트 내용' }),
          }),
        },
      },
    },
  },
  responses: {
    201: {
      description: '노트 생성 성공',
      content: {
        'application/json': {
          schema: z.object({
            id: z.number().openapi({ description: '생성된 노트 ID' }),
          }),
        },
      },
    },
    500: {
      description: '서버 오류',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
          }),
        },
      },
    },
  },
})

const updateNoteRoute = createRoute({
  method: 'patch',
  path: '/notes/{id}',
  tags: ['Notes'],
  summary: '노트 수정',
  request: {
    params: z.object({
      id: z.string().regex(/^\d+$/).transform(Number).openapi({ description: '노트 ID' }),
    }),
    body: {
      content: {
        'application/json': {
          schema: z.object({
            name: z.string().optional().openapi({ description: '노트 이름' }),
            recipe: z.number().optional().openapi({ description: '레시피 ID' }),
            bean: z.number().optional().openapi({ description: '원두 ID' }),
            content: z.string().optional().openapi({ description: '노트 내용' }),
          }),
        },
      },
    },
  },
  responses: {
    200: {
      description: '노트 수정 성공',
      content: {
        'application/json': {
          schema: z.object({
            id: z.number().openapi({ description: '수정된 노트 ID' }),
          }),
        },
      },
    },
    404: {
      description: '노트 없음',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
          }),
        },
      },
    },
  },
})

const deleteNoteRoute = createRoute({
  method: 'delete',
  path: '/notes/{id}',
  tags: ['Notes'],
  summary: '노트 삭제',
  request: {
    params: z.object({
      id: z.string().regex(/^\d+$/).transform(Number).openapi({ description: '노트 ID' }),
    }),
  },
  responses: {
    200: {
      description: '노트 삭제 성공',
      content: {
        'application/json': {
          schema: z.object({
            id: z.number().openapi({ description: '삭제된 노트 ID' }),
          }),
        },
      },
    },
    404: {
      description: '노트 없음',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
          }),
        },
      },
    },
  },
})

export default (app: OpenAPIHono) => {
  app.openapi(getNotesRoute, async (c) => c.json(await db.select().from(notes)))

  app.openapi(createNoteRoute, async (c) => {
    const values = c.req.valid('json')
    const [note] = await db.insert(notes).values(values).returning()

    if (!note) return c.json({ message: '노트 생성에 실패했습니다.' }, 500)
    return c.json({ id: note.id }, 201)
  })

  app.openapi(updateNoteRoute, async (c) => {
    const [{ id }, values] = [c.req.valid('param'), c.req.valid('json')]
    const [note] = await db.update(notes).set(values).where(eq(notes.id, id)).returning()

    if (!note) return c.json({ message: '노트를 찾을 수 없습니다.' }, 404)
    return c.json({ id: note.id }, 200)
  })

  app.openapi(deleteNoteRoute, async (c) => {
    const { id } = c.req.valid('param')
    const [note] = await db.delete(notes).where(eq(notes.id, id)).returning()

    if (!note) return c.json({ message: '노트를 찾을 수 없습니다.' }, 404)
    return c.json({ id: note.id }, 200)
  })
}
