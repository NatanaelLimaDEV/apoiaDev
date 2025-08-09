import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";



export const POST = auth(async function POST(request) {
    if (!request.auth) {
        return NextResponse.json({
            error: "Usuário não autenticado"
        }, { status: 401 })
    }

    try {
        const account = await stripe.accounts.create({
            controller: {
                losses: {
                    payments: "application"
                },
                fees: {
                    payer: "application"
                },
                stripe_dashboard: {
                    type: "express"
                }
            }
        })

        if (!account.id) {
            return NextResponse.json({
                error: "Falha ao criar conta de pagamentos"
            }, { status: 400 })
        }

        // Atualiza no banco do user logado com a conta criada do stripe
        await prisma.user.update({
            where: {
                id: request.auth.user.id
            },
            data: {
                connectedStripeAccountId: account.id
            }
        })

        const accountLink = await stripe.accountLinks.create({
            account: account.id,
            refresh_url: `${process.env.HOST_URL!}/dashboard`,
            return_url: `${process.env.HOST_URL!}/dashboard`,
            type: 'account_onboarding',
        })

        return NextResponse.json({
            url: accountLink?.url
        }, { status: 200 })

    } catch (err: any) {
        console.error("Erro ao criar conta de pagamentos:", err);
        return NextResponse.json({
            error: "Falha ao criar link de configuração",
            details: err.message || err
        }, { status: 400 })
    }
})