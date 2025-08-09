"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";


const changeDescriptionSchema = z.object({
    description: z.string().min(4, { message: "O descrção deve ter no mínimo 4 caracteres" }),
});

type ChangeDescriptionSchema = z.infer<typeof changeDescriptionSchema>;

export async function changeDescription(data: ChangeDescriptionSchema) {
    const session = await auth();
    const userId = session?.user.id;

    if (!userId) {
        return {
            data: null,
            error: "Usuário não autenticado",
        };
    }

    const schema = changeDescriptionSchema.safeParse(data);

    if (!schema.success) {
        return {
            data: null,
            error: schema.error.issues[0].message,
        };
    }

    try {
        const user = await prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                bio: data.description,
            },
        })

        return {
            data: user.bio,
            error: null,
        };
    } catch (err) {
        console.log(err);
        return {
            data: null,
            error: "Erro ao atualizar o nome",
        }
    }
}