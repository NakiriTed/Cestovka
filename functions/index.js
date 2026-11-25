const functions = require("firebase-functions");
const admin = require("firebase-admin");
require("dotenv").config({ path: "../.env" });
const stripe = require("stripe")(process.env.VITE_STRIPE_SECRET_KEY);
const cors = require("cors")({ origin: true });

admin.initializeApp();

exports.createStripeCheckout = functions.https.onRequest((req, res) => {
  // CORS povolení (aby mohl frontend komunikovat s backendem)
  cors(req, res, async () => {
    if (req.method !== 'POST') {
      return res.status(405).send('Method Not Allowed');
    }

    try {
      const { planTitle, price, email, planId } = req.body;

      // 1. Vytvoření platby (Checkout Session) ve Stripe
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        customer_email: email,
        line_items: [
          {
            price_data: {
              currency: 'czk',
              product_data: {
                name: planTitle,
                description: `Zájezd: ${planId}`
              },
              unit_amount: price * 100, // Stripe pracuje s nejmenší měnovou jednotkou (haléře)
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        // Odkazy po dokončení/zrušení platby (vracíme se zpět do Reactu)
        success_url: `http://localhost:8080/profile?payment=success`,
        cancel_url: `http://localhost:8080/planner?payment=canceled`,
      });

      // 2. Odeslání URL zpět na frontend
      res.status(200).json({ id: session.id, url: session.url });
    } catch (error) {
      console.error("Chyba Stripe:", error);
      res.status(500).json({ error: "Interní chyba při vytváření platby" });
    }
  });
});
