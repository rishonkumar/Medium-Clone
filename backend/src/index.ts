import { Hono } from 'hono'
import { UserRouter } from './routes/user'
import { blogRouter } from './routes/blog'

const app = new Hono<{
  Bindings: {
    DATABASE_URL : string
  }
}>()

app.route("/api/v1/user", UserRouter)
app.route("/api/v1/blog", blogRouter)

export default app
