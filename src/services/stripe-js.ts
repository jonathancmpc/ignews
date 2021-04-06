//REPONSÁVEL PELA INTERAÇÃO COM O JAVASCRIPT/DOM/FRONT, ENQUANTO O STRIPE.TS É REPONSÁVEL PELA PARTE DA API E BACK
import { loadStripe } from '@stripe/stripe-js';

export async function getStripeJs() {
  const stripeJs = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

  return stripeJs;
}