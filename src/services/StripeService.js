import Stripe from "stripe"
import User from "../../src/models/User.js"

const secret = process.env.STRIPE_SECRET_KEY
const webhook_secret = process.env.STRIPE_WEBHOOK_SECRET
const stripe = new Stripe('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')

export const addNewCustomer = async (email, description) => {
    try{
        const customer = await stripe.customers.create({
            email,
            description,
            // test_clock: 'clock_1OMj5eB2WsI6rZwTNuWRcoFf',
        })
        return customer.id
    } catch (err) {
        console.log(err.message)
    }
    
}

export const getCustomerById = async (id) => {
    try{
        const customer = await stripe.customers.retrieve(id)
        return customer
    } catch (err) {
        console.log(err.message)
    }
   
}

export const getCustomerByEmail = async (email) => {
    try {
      const customers = await stripe.customers.list({ email: email });
      
      if (customers.data.length > 0) {
        // Retorna o ID do primeiro cliente encontrado (assumindo que o email é único)
        return customers.data[0].id;
      } else {
        return null; // Retorna null se nenhum cliente foi encontrado com o email fornecido
      }
    } catch (err) {
      console.log(err.message);
    }
  };


 export const listenStripeWebhook = async (req, res) => {
    const endpointSecret = 'whsec_ttb5v6UBG6j6KjYUtO5dNN9vw2oEtWdT';
    const sig = req.headers['stripe-signature'];

    try {
        // Verificar a assinatura do webhook
        const event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
        console.log("Webhook Event:", JSON.stringify(event, null, 2));

        // Lidar com o evento
        switch (event.type) {
            case 'invoice.payment_succeeded':
                console.log("Pagamento bem sucedido!");
                handleSuccessfulPayment(event.data.object.customer);
                break;
            case 'invoice.payment_failed':
                console.log("Pagamento mal sucedido, tente novamente!");
                handleFailedPayment(event.data.object.customer);
                break;
            case 'customer.subscription.deleted':
                console.log("Assinatura do cliente cancelada");
                handleFailedPayment(event.data.object.customer);
                break;
            case 'customer.deleted':
                console.log("Assinatura do cliente cancelada");
                handleFailedPayment(event.data.object.customer);
                break;
            case 'checkout.session.completed':
                const session = event.data.object;
                console.log("Checkout bem-sucedido.");

                if (session.payment_status === 'paid') {
                    handleSuccessfulPayment(session.customer);
                } else {
                    handleFailedPayment(session.customer);
                }
                break;
            default:
                console.log(`Evento não tratado: ${event.type}`);
        }
        res.status(200).send(); // Envie uma resposta de sucesso ao Stripe
    } catch (err) {
        console.error('Erro durante a manipulação do evento de webhook:', err.message);
        console.log(err)
        res.status(400).json({ msg: 'Webhook Error' });
    }
};


// Função para lidar com pagamento bem-sucedido
export async function handleSuccessfulPayment(customerId) {
    try {
        console.log(`Handling successful payment for customer: ${customerId}`);
        
        const user = await User.findOne({ customerId });

        if (!user) {
            console.error(`Usuário não encontrado com o ID do cliente do Stripe: ${customerId}`);
            return;
        }

        // Atualize o status da assinatura no modelo do usuário
        user.subscription = 'active';

        // Salve as alterações no banco de dados
        await user.save();

        console.log(`Status da assinatura atualizado para 'active' para o usuário: ${user._id}`);
    } catch (error) {
        console.error('Erro ao atualizar o status da assinatura:', error.message);
        throw error;
    }
}


// Função para lidar com pagamento falhado
export async function handleFailedPayment(customerId) {
    try {
        const user = await User.findOne({ customerId });

        if (!user) {
            console.error(`Usuário não encontrado com o ID do cliente do Stripe: ${customerId}`);
            return;
        }

        // Atualize o status da assinatura no modelo do usuário
        user.subscription = 'inactive';

        // Salve as alterações no banco de dados
        await user.save();

        console.log(`Status da assinatura atualizado para 'inactive' para o usuário: ${user._id}`);
    } catch (error) {
        console.error('Erro ao atualizar o status da assinatura:', error.message);
        throw error;
    }
}
