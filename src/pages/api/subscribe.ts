import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from 'next-auth/client';
import { stripe } from "../../services/stripe";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    //criamos primeiramente o perfil do cliente dentro do stripe, pegamos as informações através do cookies no método getSession do Next-Auth
    const session = await getSession({ req });
    
    const stripeCustomer = await stripe.customers.create({
      email: session.user.email,
    });

    const stripeCheckoutSession = await stripe.checkout.sessions.create({
      customer: stripeCustomer.id, //quem está comprando o produto, é passado o id do usuário do stripe
      payment_method_types: ['card'], // pagamento com cartão
      billing_address_collection: 'required', // requeremos o endereço do comprador
      line_items: [
        { price: 'price_1IcrmoLGRE9h3OAlNpFyIkoA', quantity: 1 } //id do preço e quantidade de produtos
      ],
      mode: 'subscription', //pagamento recorrente
      allow_promotion_codes: true, //deixa habilitadoo código de promoção
      success_url: process.env.STRIPE_SUCCESS_URL, //url que o usuário é redirecionado após a compra
      cancel_url: process.env.STRIPE_CANCEL_URL
    });

    return res.status(200).json({ sessionId: stripeCheckoutSession.id }) //passamos o id da sessão de checkout criada no stripe
  } else {
    res.setHeader('Allow', 'POST'); //só aceita métofo post nessa rota
    res.status(405).end('Method not allowed');
  }
}