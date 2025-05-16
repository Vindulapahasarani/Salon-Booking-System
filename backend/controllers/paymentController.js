const Appointment = require('../models/Appointment');
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// Get all unpaid appointments for the logged-in user
exports.getUnpaidAppointments = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming you have user authentication middleware

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
    const userId = req.user.id; // Assuming you have user authentication middleware

    if (!appointmentIds || !Array.isArray(appointmentIds) || appointmentIds.length === 0) {
      return res.status(400).json({ message: 'No appointments selected' });
    }

    // Update appointments to mark them as paid
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
    const { appointmentIds } = req.body;
    const userId = req.user.id; // Assuming you have user authentication middleware

    if (!appointmentIds || !Array.isArray(appointmentIds) || appointmentIds.length === 0) {
      return res.status(400).json({ message: 'No appointments selected' });
    }

    // Fetch the appointments to be paid
    const appointments = await Appointment.find({
      _id: { $in: appointmentIds },
      userId: userId,
      paymentStatus: 'unpaid'
    });

    if (appointments.length === 0) {
      return res.status(404).json({ message: 'No valid unpaid appointments found' });
    }

    // Create line items for Stripe checkout
    const lineItems = appointments.map(appointment => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: appointment.serviceName,
          description: `Appointment on ${new Date(appointment.date).toLocaleDateString()} at ${appointment.timeSlot}`,
        },
        unit_amount: Math.round(appointment.price * 100), // Stripe uses cents
      },
      quantity: 1,
    }));

    // Create checkout session
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

  // Handle the checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    
    // Extract appointment IDs from metadata
    const appointmentIds = session.metadata.appointmentIds.split(',');
    
    try {
      // Update appointments to mark them as paid
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