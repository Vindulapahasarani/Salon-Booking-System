const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// Create Stripe Checkout Session
exports.createCheckoutSession = async (req, res) => {
  try {
    const { serviceName, price, serviceId, userId } = req.body;

    // Validate input
    if (!serviceName || !price || !serviceId || !userId) {
      return res.status(400).json({
        message: 'Missing required fields: serviceName, price, serviceId, userId'
      });
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: serviceName
            },
            unit_amount: Math.round(price * 100) // Convert to cents
          },
          quantity: 1
        }
      ],
      success_url: `${process.env.CLIENT_URL}/booking/success?session_id={CHECKOUT_SESSION_ID}&serviceId=${serviceId}`,
      cancel_url: `${process.env.CLIENT_URL}/services`,
      metadata: {
        serviceId,
        userId,
        serviceName,
        price: price.toString()
      }
    });

    res.status(200).json({
      id: session.id,
      url: session.url
    });
  } catch (err) {
    console.error('❌ Stripe createCheckoutSession error:', err.stack || err.message);
    res.status(500).json({
      message: 'Stripe session creation failed',
      error: err.message
    });
  }
};
