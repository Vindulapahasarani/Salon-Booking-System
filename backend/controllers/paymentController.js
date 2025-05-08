const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

exports.createCheckoutSession = async (req, res) => {
  try {
    const { serviceName, price, serviceId, userId } = req.body;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: { name: serviceName },
          unit_amount: price * 100,
        },
        quantity: 1,
      }],
      success_url: `${process.env.CLIENT_URL}/booking/success?serviceId=${serviceId}`,
      cancel_url: `${process.env.CLIENT_URL}/services`,
      metadata: { serviceId, userId }
    });

    res.status(200).json({ id: session.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Stripe session creation failed' });
  }
};
