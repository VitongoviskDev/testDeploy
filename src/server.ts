import { PrismaClient } from "@prisma/client";
import fastify from "fastify";
import { number, z } from 'zod'

const app = fastify();

const prisma = new PrismaClient()

app.get('/users', async () => {
    const users = await prisma.user.findMany();

    return users;
})
app.post('/users', async (req, reply) => {
    const createUserSchema = z.object({
        name: z.string(),
        email: z.string().email()
    }

    )
    const { name, email } = createUserSchema.parse(req.body);

    await prisma.user.create({
        data: {
            name,
            email,
        }
    })

    return reply.status(201).send();
})

app.listen({ port: process.env.PORT ? Number(process.env.PORT) : 4000, host: '0.0.0.0' }, (err, address) => {
    if (err) {
        app.log.error(err)
        process.exit(1)
    }
    app.log.info(`server listening on ${address}`)
})