import { Hono } from "hono";
import { PrismaClient } from "../generated/prisma/client"; 
import { withAccelerate } from '@prisma/extension-accelerate'
import { decode,sign,verify } from 'hono/jwt'
export const UserRouter = new Hono()

const app = new Hono<{
  Bindings: {
    DATABASE_URL : string
  }
}>()

app.post("/signup",  async (c) => {

    const prisma = new PrismaClient({
      //@ts-ignore
      datasourceUrl : c.env.DATABASE_URL
    }).$extends(withAccelerate())
  
    const body = await c.req.json()
  
    try{
      const user = await prisma.user.create({
        data : { 
          email : body.email,
          password : body.password,
        }
      })
    
      const token = await sign({id : user.id}, "secret")
    
      return c.json({
        jwt : token
      })
    } catch(error) {
      c.status(411)
      return c.json({
        err : error
      })
    }
    
  
  })
  
  
  app.post("/signin", async (c) => {
  
    const prisma = new PrismaClient({
      //@ts-ignore
      datasourceUrl : c.env?.DATABASE_URL,
    }).$extends(withAccelerate())
  
    const body = await c.req.json()
  
    const user = await prisma.user.findUnique({
      where : {
        email : body.email
      }
    })
  
    if(!user) {
      c.status(403)
      return c.json({error : "User not found"})
    }
  
    const jwt = await sign({id : user.id}, "secret")
    return c.json({jwt})
  })