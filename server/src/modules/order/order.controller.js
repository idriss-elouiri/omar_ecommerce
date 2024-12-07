import Order from "./order.model.js";

export async function getOrder(req, res, next) {
  try {
    const { _id } = req.query;
    const { userEmail } = req.query;

    // Inside your getOrder function
    if (_id) {
      const order = await Order.findById(_id);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      return res.status(200).json(order);
    }

    if (req.user.isAdmin) {
      const orders = await Order.find();
      return res.status(200).json(orders);
    }

    if (userEmail) {
      const orders = await Order.find({userEmail });
      return res.status(200).json(orders);
    }

    return res.status(400).json({ message: "No orders found" });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
