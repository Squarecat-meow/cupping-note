import { createRoute, type OpenAPIHono } from '@hono/zod-openapi'
import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '../db.js'
import { recipes } from '../schema/recipes.js'

const getRecipesRoute = createRoute({
  method: 'get',
  path: '/recipes',
  tags: ['Recipes'],
  summary: '레시피 목록 조회',
  responses: {
    200: {
      description: '레시피 목록 조회 성공',
      content: {
        'application/json': {
          schema: z.array(
            z.object({
              id: z.number().openapi({ description: '레시피 ID' }),
              name: z.string().openapi({ description: '레시피 이름' }),
              description: z.string().openapi({ description: '레시피 설명' }),
              instructions: z.string().openapi({ description: '레시피 상세 설명' }),
              waterAmount: z.number().openapi({ description: '물 양 (ml)' }),
              beanAmount: z.number().openapi({ description: '원두 양 (g)' }),
              brewTime: z.number().openapi({ description: '추출 시간 (초)' }),
              temperature: z.number().openapi({ description: '물 온도 (°C)' }),
              grinderType: z.enum(['manual', 'electric']).openapi({ description: '그라인더 타입' }),
              grinderName: z.string().nullable().openapi({ description: '그라인더 이름' }),
              grinderClicks: z.number().nullable().openapi({ description: '그라인더 분쇄도 (클릭 수)' }),
            }),
          ),
        },
      },
    },
  },
})

const createRecipeRoute = createRoute({
  method: 'post',
  path: '/recipes',
  tags: ['Recipes'],
  summary: '레시피 생성',
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.object({
            name: z.string().openapi({ description: '레시피 이름' }),
            description: z.string().openapi({ description: '레시피 설명' }),
            instructions: z.string().openapi({ description: '레시피 상세 설명' }),
            waterAmount: z.number().openapi({ description: '물 양 (ml)' }),
            beanAmount: z.number().openapi({ description: '원두 양 (g)' }),
            brewTime: z.number().openapi({ description: '추출 시간 (초)' }),
            temperature: z.number().openapi({ description: '물 온도 (°C)' }),
            grinderType: z.enum(['manual', 'electric']).openapi({ description: '그라인더 타입' }),
            grinderName: z.string().optional().openapi({ description: '그라인더 이름' }),
            grinderClicks: z.number().optional().openapi({ description: '그라인더 분쇄도 (클릭 수)' }),
          }),
        },
      },
    },
  },
  responses: {
    201: {
      description: '레시피 생성 성공',
      content: {
        'application/json': {
          schema: z.object({
            id: z.number().openapi({ description: '생성된 레시피 ID' }),
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

const updateRecipeRoute = createRoute({
  method: 'patch',
  path: '/recipes/{id}',
  tags: ['Recipes'],
  summary: '레시피 수정',
  request: {
    params: z.object({
      id: z.string().regex(/^\d+$/).transform(Number).openapi({ description: '레시피 ID' }),
    }),
    body: {
      content: {
        'application/json': {
          schema: z.object({
            name: z.string().optional().openapi({ description: '레시피 이름' }),
            description: z.string().optional().openapi({ description: '레시피 설명' }),
            instructions: z.string().optional().openapi({ description: '레시피 상세 설명' }),
            waterAmount: z.number().optional().openapi({ description: '물 양 (ml)' }),
            beanAmount: z.number().optional().openapi({ description: '원두 양 (g)' }),
            brewTime: z.number().optional().openapi({ description: '추출 시간 (초)' }),
            temperature: z.number().optional().openapi({ description: '물 온도 (°C)' }),
            grinderType: z.enum(['manual', 'electric']).optional().openapi({ description: '그라인더 타입' }),
            grinderName: z.string().optional().openapi({ description: '그라인더 이름' }),
            grinderClicks: z.number().optional().openapi({ description: '그라인더 분쇄도 (클릭 수)' }),
          }),
        },
      },
    },
  },
  responses: {
    200: {
      description: '레시피 수정 성공',
      content: {
        'application/json': {
          schema: z.object({
            id: z.number().openapi({ description: '수정된 레시피 ID' }),
          }),
        },
      },
    },
    404: {
      description: '레시피 없음',
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

const deleteRecipeRoute = createRoute({
  method: 'delete',
  path: '/recipes/{id}',
  tags: ['Recipes'],
  summary: '레시피 삭제',
  request: {
    params: z.object({
      id: z.string().regex(/^\d+$/).transform(Number).openapi({ description: '레시피 ID' }),
    }),
  },
  responses: {
    200: {
      description: '레시피 삭제 성공',
      content: {
        'application/json': {
          schema: z.object({
            id: z.number().openapi({ description: '삭제된 레시피 ID' }),
          }),
        },
      },
    },
    404: {
      description: '레시피 없음',
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
  app.openapi(getRecipesRoute, async (c) => c.json(await db.select().from(recipes)))

  app.openapi(createRecipeRoute, async (c) => {
    const values = c.req.valid('json')
    const [recipe] = await db.insert(recipes).values(values).returning()

    if (!recipe) return c.json({ message: '레시피 생성에 실패했습니다.' }, 500)
    return c.json({ id: recipe.id }, 201)
  })

  app.openapi(updateRecipeRoute, async (c) => {
    const [{ id }, values] = [c.req.valid('param'), c.req.valid('json')]
    const [recipe] = await db.update(recipes).set(values).where(eq(recipes.id, id)).returning()

    if (!recipe) return c.json({ message: '레시피를 찾을 수 없습니다.' }, 404)
    return c.json({ id: recipe.id }, 200)
  })

  app.openapi(deleteRecipeRoute, async (c) => {
    const { id } = c.req.valid('param')
    const [recipe] = await db.delete(recipes).where(eq(recipes.id, id)).returning()

    if (!recipe) return c.json({ message: '레시피를 찾을 수 없습니다.' }, 404)
    return c.json({ id: recipe.id }, 200)
  })
}
