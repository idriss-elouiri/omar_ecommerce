import Order from "../order/order.model.js";
import Product from "../product/product.model.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SK);

export async function create(req, res) {
  try {
    const { cartProducts, address } = req.body;
    const userEmail = req.user.email;

    // Check for cartProducts
    if (!cartProducts || cartProducts.length === 0) {
      return res
        .status(400)
        .json({ message: "No products found in the cart." });
    }

    const productsArray = Array.isArray(cartProducts)
      ? cartProducts
      : [cartProducts];

    // Create an order document with paid: false initially
    const orderDoc = await Order.create({
      userEmail,
      ...address,
      cartProducts: productsArray,
      paid: true,
    });
    console.log("Order ID:", orderDoc._id);

    const stripeLineItems = await Promise.all(
      productsArray.map(async (cartProduct) => {
        const productInfo = await Product.findById(cartProduct._id);
        if (!productInfo) {
          throw new Error(`Product not found for ID: ${cartProduct._id}`);
        }

        return {
          quantity: 1,
          price_data: {
            currency: "USD",
            product_data: {
              name: cartProduct.title,
            },
            unit_amount: Math.round(productInfo.price) * 100, // Convert to cents
          },
        };
      })
    );

    // Create a Stripe checkout session
    const stripeSession = await stripe.checkout.sessions.create({
      line_items: stripeLineItems,
      mode: "payment",
      customer_email: userEmail,
      success_url: `${
        process.env.FRONTEND_URL
      }/order/${orderDoc._id.toString()}?clear-cart=1`,
      cancel_url: `${process.env.FRONTEND_URL}/cart?canceled=1`,
      metadata: { orderId: orderDoc._id.toString() },
      payment_intent_data: {
        metadata: { orderId: orderDoc._id.toString() },
      },
      shipping_options: [
        {
          shipping_rate_data: {
            display_name: "Delivery fee",
            type: "fixed_amount",
            fixed_amount: { amount: 500, currency: "USD" },
          },
        },
      ],
    });

    return res.status(200).json({ url: stripeSession.url });
  } catch (error) {
    console.error("Error creating order:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
}
