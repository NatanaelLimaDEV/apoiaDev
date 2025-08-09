"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { createSlug } from "@/utils/create-slug"
import { z } from "zod"

const createUsernameSchema = z.object({
    username: z.string({ message: "O username é obrigatório" }).min(4, { message: "O username deve ter no mínimo 4 caracteres" }),
})

type CreateUsernameFormData = z.infer<typeof createUsernameSchema>

export async function createUsername(data: CreateUsernameFormData) {

    const session = await auth()

    if (!session?.user) {
        return {
            data: null,
            error: "Usuário não autenticado"
        }
    }

    const schema = createUsernameSchema.safeParse(data)

    if (!schema.success) {
        return {
            data: null,
            error: schema.error.issues[0].message
        }
        
    }

    try {
        const userId = session.user.id

        const slug = createSlug(data.username)
        
        // Verifica se o username já existe
        const existingUser = await prisma.user.findFirst({
            where: {
                userName: slug
            }
        })
        
        if(existingUser){
            return {
                data: null,
                error: "Username já existente, tente outro"
            }
        }
        

        await prisma.user.update({
            where: {
                id: userId
            },
            data: {
                userName: slug
            }
        })

        return {
            data: slug,
            error: null
        }
    } catch (err) {
        return {
            data: null,
            error: "Erro ao atualizar username"
        }
    }
}