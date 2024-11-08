import Stripe from "stripe"
import User from "../models/User.js"


import dotenv from 'dotenv'

dotenv.config()

const stripe_secret = process.env.STRIPE_SECRET_KEY
const secret = process.env.STRIPE_SECRET_KEY
const annualPrice = process.env.ANNUAL_PRICE
const monthlyPrice = process.env.MONTHLY_PRICE
const stripe = new Stripe(`${stripe_secret}`)

  export const createCheckout = async (req, res, next) => {
    try {
        const id = req.params.id;  // Ajuste para obter o ID do usuário do req.user
        const subscriptionType = req.body.subscriptionType;  // Ajuste para obter o ID do usuário do req.user
        const user = await User.findById({_id: id});
        const customer = user.customerId

        const session = await stripe.checkout.sessions.create({
            customer: customer,
            line_items: [
              {
                // Fornecer o ID exato do preço (por exemplo, pr_1234) do produto que você deseja vender
                price: subscriptionType === 'annual' ? annualPrice : monthlyPrice,
                quantity: 1,
              },
            ],
            mode: "subscription",
            success_url: `https://holyapp.com.br/`,
            cancel_url: `https://holyapp.com.br/`,
            subscription_data: {
                trial_period_days: 7
            }
          });

          res.status(200).json({ msg: `Checkout iniciado com sucesso`, clientSecret: session.client_secret, id: session.id, url: session.url, customer: customer, email: user.email });
        next();
    } catch (err) {
        res.status(500).json({ status: 'failed', msg: err.message });
    }
};

export const createCustomerPortalSession = async (req, res, next) => {
    const userId = req.params.id;
    const user = await User.findById({_id: userId});

    try {
        if (!user) {
            return res.status(404).json({ status: 'failed', msg: 'Usuário não encontrado' });
        }

        // Aqui, você pode verificar o estado da assinatura no Stripe usando o ID do cliente associado ao usuário
        const stripeSubscriptions = await stripe.subscriptions.list({
            customer: user.customerId
        });
        console.log(stripeSubscriptions)

        if (stripeSubscriptions && stripeSubscriptions.data && stripeSubscriptions.data.length > 0) {
            // O usuário tem uma assinatura ativa
            const session = await stripe.billingPortal.sessions.create({
                customer: user.customerId,
                return_url: 'https://holyapp.com.br/',
            });

            console.log(session)
            // Passe o ID do cliente associado ao usuário, ou o ID da sessão, para que o frontend possa redirecionar
            res.status(200).json({ msg: `Checkout iniciado com sucesso`, session, id: session.id, url: session.url });
            next();
        } else {
            // O usuário não tem uma assinatura ativa, pode implementar lógica adicional aqui se necessário
            res.status(403).json({ status: 'failed', msg: 'Usuário não pagou o checkout' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'failed', msg: 'Erro ao iniciar a sessão no Customer Portal', error: err.message });
    }
};
