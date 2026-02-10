import { Hono } from "hono";
import { verify } from "hono/jwt";
import { PrismaClient } from "../generated/prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

export const blogRouter = new Hono()

const app = new Hono<{
    Bindings: {
      DATABASE_URL : string
    }
  }>()

app.use("/*", async (c,next) => {

    const header = c.req.header("authorization") || "";
    const token = header.split(" ")[1]
    const response = await verify(token,"secret","ES256")
  
    if(response.id) {
      next()
    } else {
      c.status(403)
      return c.json({error : "unauthorized"})
    }
  })

app.post("/", async (c) => {

    const prisma = new PrismaClient({
        //@ts-ignore
        datasourceUrl : c.env.DATABASE_URL
      }).$extends(withAccelerate())
    
    const body = await c.req.json()
    

    const blog = await prisma.post.create({
        data : {
            title : body.title,
            content : body.content,
            authorId : "1"
        }
    })

    return c.json({
        id : blog.id
    })
    
})
  