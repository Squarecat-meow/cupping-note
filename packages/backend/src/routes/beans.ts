import { createRoute, type OpenAPIHono } from '@hono/zod-openapi'
import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '../db.js'
import { beans } from '../schema/beans.js'

const getBeansRoute = createRoute({
  method: 'get',
  path: '/beans',
  tags: ['Beans'],
  summary: '원두 목록 조회',
  responses: {
    200: {
      description: '원두 목록 조회 성공',
      content: {
        'application/json': {
          schema: z.array(
            z.object({
              id: z.number().openapi({ description: '원두 ID' }),
              name: z.string().openapi({ description: '원두 이름' }),
            }),
          ),
        },
      },
    },
  },
})

const createBeanRoute = createRoute({
  method: 'post',
  path: '/beans',
  tags: ['Beans'],
  summary: '원두 생성',
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.object({
            name: z.string().openapi({ description: '원두 이름' }),
            origin: z.string().openapi({ description: '원두 원산지' }),
            variety: z.string().openapi({ description: '원두 품종' }),
            roastLevel: z.string().openapi({ description: '원두 로스팅 정도' }),
          }),
        },
      },
    },
  },
  responses: {
    201: {
      description: '원두 생성 성공',
      content: {
        'application/json': {
          schema: z.object({
            id: z.number().openapi({ description: '생성된 원두 ID' }),
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

const updateBeanRoute = createRoute({
  method: 'patch',
  path: '/beans/{id}',
  tags: ['Beans'],
  summary: '원두 수정',
  request: {
    params: z.object({
      id: z.string().regex(/^\d+$/).transform(Number).openapi({ description: '원두 ID' }),
    }),
    body: {
      content: {
        'application/json': {
          schema: z.object({
            name: z.string().optional().openapi({ description: '원두 이름' }),
            origin: z.string().optional().openapi({ description: '원두 원산지' }),
            variety: z.string().optional().openapi({ description: '원두 품종' }),
            roastLevel: z.string().optional().openapi({ description: '원두 로스팅 정도' }),
          }),
        },
      },
    },
  },
  responses: {
    200: {
      description: '원두 수정 성공',
      content: {
        'application/json': {
          schema: z.object({
            id: z.number().openapi({ description: '수정된 원두 ID' }),
          }),
        },
      },
    },
    404: {
      description: '원두 없음',
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

const deleteBeanRoute = createRoute({
  method: 'delete',
  path: '/beans/{id}',
  tags: ['Beans'],
  summary: '원두 삭제',
  request: {
    params: z.object({
      id: z.string().regex(/^\d+$/).transform(Number).openapi({ description: '원두 ID' }),
    }),
  },
  responses: {
    200: {
      description: '원두 삭제 성공',
      content: {
        'application/json': {
          schema: z.object({
            id: z.number().openapi({ description: '삭제된 원두 ID' }),
          }),
        },
      },
    },
    404: {
      description: '원두 없음',
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
  app.openapi(getBeansRoute, async (c) => c.json(await db.select().from(beans)))

  app.openapi(createBeanRoute, async (c) => {
    const values = c.req.valid('json')
    const [bean] = await db.insert(beans).values(values).returning()
    if (!bean) return c.json({ message: '원두 생성에 실패했습니다.' }, 500)
    return c.json({ id: bean.id }, 201)
  })

  app.openapi(updateBeanRoute, async (c) => {
    const [{ id }, values] = [c.req.valid('param'), c.req.valid('json')]
    const [bean] = await db.update(beans).set(values).where(eq(beans.id, id)).returning()

    if (!bean) return c.json({ message: '원두를 찾을 수 없습니다.' }, 404)
    return c.json({ id: bean.id }, 200)
  })

  app.openapi(deleteBeanRoute, async (c) => {
    const { id } = c.req.valid('param')
    const [bean] = await db.delete(beans).where(eq(beans.id, id)).returning()

    if (!bean) return c.json({ message: '원두를 찾을 수 없습니다.' }, 404)
    return c.json({ id: bean.id }, 200)
  })
}
