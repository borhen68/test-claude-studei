import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn('STRIPE_SECRET_KEY not set - Stripe will not work');
}

export const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-12-18.acacia' as any,
      typescript: true,
    })
  : null;

export interface CreateCheckoutSessionParams {
  bookId: string;
  priceInCents: number;
  successUrl: string;
  cancelUrl: string;
  customerEmail?: string;
}

export async function createCheckoutSession(params: CreateCheckoutSessionParams) {
  if (!stripe) throw new Error('Stripe not configured');
  
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    line_items: [{
      price_data: {
        currency: 'usd',
        product_data: {
          name: 'Frametale Photo Book',
          description: '8x8" hardcover photo book',
        },
        unit_amount: params.priceInCents,
      },
      quantity: 1,
    }],
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
    metadata: { bookId: params.bookId },
    shipping_address_collection: { allowed_countries: ['US'] },
  });

  return session;
}

export function verifyWebhookSignature(payload: string | Buffer, signature: string) {
  if (!stripe) throw new Error('Stripe not configured');
  if (!process.env.STRIPE_WEBHOOK_SECRET) throw new Error('STRIPE_WEBHOOK_SECRET not set');
  
  return stripe.webhooks.constructEvent(payload, signature, process.env.STRIPE_WEBHOOK_SECRET);
}
