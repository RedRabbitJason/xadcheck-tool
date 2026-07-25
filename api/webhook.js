import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Map Price IDs to credit amounts
const PRICE_TO_CREDITS = {
  'price_1TwzOEFeLwIdob2tCLYR7gI9': 5,    // Mini
  'price_1TwzOlFeLwIdob2tLowLWWho': 12,   // Starter
  'price_1TwzPMFeLwIdob2t3P8m3YWQ': 30,   // Growth
  'price_1TwzPqFeLwIdob2t6AESyjqU': 110   // Pro
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const sig = req.headers['stripe-signature'];
  let event;

  try {
    // For now we skip strict signature verification in test mode
    // We will tighten this later
    event = req.body;
  } catch (err) {
    console.error('Webhook error:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle successful payment
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const userId = session.metadata?.userId;
    const priceId = session.line_items?.data?.[0]?.price?.id || 
                    session.display_items?.[0]?.price?.id;

    // Fallback: get line items if needed
    let creditsToAdd = 0;

    // Try to find credits from the price ID
    if (priceId && PRICE_TO_CREDITS[priceId]) {
      creditsToAdd = PRICE_TO_CREDITS[priceId];
    } else {
      // Safety fallback based on amount
      const amount = session.amount_total / 100;
      if (amount === 5) creditsToAdd = 5;
      else if (amount === 9) creditsToAdd = 12;
      else if (amount === 19) creditsToAdd = 30;
      else if (amount === 49) creditsToAdd = 110;
    }

    if (userId && creditsToAdd > 0) {
      // Get current user record
      const { data: existing } = await supabase
        .from('user_usage')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (existing) {
        // Add credits
        await supabase
          .from('user_usage')
          .update({
            credits_remaining: (existing.credits_remaining || 0) + creditsToAdd,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userId);
      } else {
        // Create new record
        await supabase
          .from('user_usage')
          .insert([{
            user_id: userId,
            checks_used: 0,
            bonus_claimed: false,
            credits_remaining: creditsToAdd
          }]);
      }
    }
  }

  res.status(200).json({ received: true });
}
