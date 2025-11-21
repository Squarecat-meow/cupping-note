import { serve } from '@hono/node-server'
import { swaggerUI } from '@hono/swagger-ui'
import { OpenAPIHono } from '@hono/zod-openapi'
import pkg from '../package.json' with { type: 'json' }
import notes from './routes/notes.js'

const app = new OpenAPIHono()

app.doc('/doc', { openapi: '3.0.0', info: { version: '1.0.0', title: pkg.name } })

app.get('/ui', swaggerUI({ url: '/doc' }))

notes(app)

serve({ fetch: app.fetch, port: 4000 })
