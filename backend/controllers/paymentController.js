const Appointment = require('../models/Appointment');
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// Get all unpaid appointments for the logged-in user
exports.getUnpaidAppointments = async (req, res) => {
  try {
    const userId = req.user.id;

    const unpaidAppointments = await Appointment.find({
      userId: userId,
      paymentStatus: 'unpaid'
    }).select('serviceName price date timeSlot')
      .sort({ date: 1 });

    res.status(200).json(unpaidAppointments);
  } catch (error) {
    console.error('Error fetching unpaid appointments:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Mark selected appointments as paid with cash
exports.processCashPayment = async (req, res) => {
  try {
    const { appointmentIds } = req.body;
    const userId = req.user.id;

    if (!appointmentIds || !Array.isArray(appointmentIds) || appointmentIds.length === 0) {
      return res.status(400).json({ message: 'No appointments selected' });
    }

    const result = await Appointment.updateMany(
      {
        _id: { $in: appointmentIds },
        userId: userId,
        paymentStatus: 'unpaid'
      },
      {
        $set: { 
          paymentStatus: 'paid',
          paymentMethod: 'cash',
          updatedAt: new Date()
        }
      }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: 'No appointments were updated' });
    }

    res.status(200).json({ 
      message: 'Cash payment processed successfully', 
      updatedCount: result.modifiedCount 
    });
  } catch (error) {
    console.error('Error processing cash payment:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create Stripe checkout session
exports.createCheckoutSession = async (req, res) => {
  try {
    console.log('Received request to /api/payments/stripe/checkout');
    const { appointmentIds } = req.body;
    const userId = req.user.id;

    if (!appointmentIds || !Array.isArray(appointmentIds) || appointmentIds.length === 0) {
      return res.status(400).json({ message: 'No appointments selected' });
    }

    const appointments = await Appointment.find({
      _id: { $in: appointmentIds },
      userId: userId,
      paymentStatus: 'unpaid'
    });

    if (appointments.length === 0) {
      return res.status(404).json({ message: 'No valid unpaid appointments found' });
    }

    const lineItems = appointments.map(appointment => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: appointment.serviceName,
          description: `Appointment on ${new Date(appointment.date).toLocaleDateString()} at ${appointment.timeSlot}`,
        },
        unit_amount: Math.round(appointment.price * 100),
      },
      quantity: 1,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/booking/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/dashboard`,
      metadata: {
        appointmentIds: appointmentIds.join(','),
        userId
      },
    });

    console.log('Stripe session created:', session.url);
    res.status(200).json({ 
      id: session.id,
      url: session.url 
    });
  } catch (error) {
    console.error('❌ Stripe checkout session error:', error);
    res.status(500).json({ message: 'Error creating checkout session', error: error.message });
  }
};

// Handle Stripe webhook for successful payments
exports.handleStripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('❌ Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    
    const appointmentIds = session.metadata.appointmentIds.split(',');
    
    try {
      await Appointment.updateMany(
        {
          _id: { $in: appointmentIds }
        },
        {
          $set: { 
            paymentStatus: 'paid',
            paymentMethod: 'card',
            updatedAt: new Date()
          }
        }
      );
      
      console.log(`✅ Payment successful for appointments: ${appointmentIds.join(', ')}`);
    } catch (error) {
      console.error('❌ Error updating appointments after payment:', error);
    }
  }

  res.status(200).json({ received: true });
};

// Verify Stripe payment session
exports.verifyPayment = async (req, res) => {
  try {
    const { sessionId } = req.body;
    if (!sessionId) {
      return res.status(400).json({ message: 'Session ID is required' });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status !== 'paid') {
      return res.status(400).json({ message: 'Payment not completed' });
    }

    const appointmentIds = session.metadata.appointmentIds.split(',');
    const appointments = await Appointment.find({
      _id: { $in: appointmentIds },
      paymentStatus: 'paid',
      paymentMethod: 'card',
    }).select('serviceName price date timeSlot');

    res.status(200).json({
      success: true,
      appointments: appointments.map((appt) => ({
        id: appt._id,
        serviceName: appt.serviceName,
        price: appt.price,
        date: appt.date,
        timeSlot: appt.timeSlot,
      })),
    });
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ message: 'Error verifying payment', error: error.message });
  }
};