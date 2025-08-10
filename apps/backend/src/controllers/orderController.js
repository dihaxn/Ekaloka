import orderModel from "../models/orderModel.js";
import userModel from '../models/userModel.js';
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Placing User Order for Frontend
const placeOrder = async (req, res) => {
    const frontend_url = "http://localhost:3000";
    const { userId, items, amount, address } = req.body;

    if (!userId || !items || !amount || !address) {
        return res.status(400).json({ success: false, message: "Missing required fields for order." });
    }

    try {
        const newOrder = new orderModel({
            userId,
            items,
            amount,
            address
        });
        await newOrder.save();
        await userModel.findByIdAndUpdate(userId, { cartData: {} });

        const line_items = items.map((item) => ({
            price_data: {
                currency: "inr",
                product_data: {
                    name: item.name
                },
                unit_amount: item.price * 100 * 80 // Consider making currency conversion more robust
            },
            quantity: item.quantity
        }));

        line_items.push({
            price_data: {
                currency: "inr",
                product_data: {
                    name: "Delivery Charges"
                },
                unit_amount: 2 * 100 * 80
            },
            quantity: 1
        });

        const session = await stripe.checkout.sessions.create({
            line_items: line_items,
            mode: 'payment',
            success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
        });

        res.status(200).json({ success: true, session_url: session.url });

    } catch (error) {
        console.error("Error placing order:", error);
        res.status(500).json({ success: false, message: "An unexpected error occurred while placing the order." });
    }
};

const verifyOrder = async (req, res) => {
    const { orderId, success } = req.body;

    if (!orderId || success === undefined) {
        return res.status(400).json({ success: false, message: "Missing required fields for verification." });
    }

    try {
        if (success === "true") {
            await orderModel.findByIdAndUpdate(orderId, { payment: true });
            res.status(200).json({ success: true, message: "Order Paid" });
        } else {
            await orderModel.findByIdAndDelete(orderId);
            res.status(200).json({ success: false, message: "Order Not Paid and Canceled" });
        }
    } catch (error) {
        console.error("Error verifying order:", error);
        res.status(500).json({ success: false, message: "An unexpected error occurred while verifying the order." });
    }
};

// User Orders for Frontend
const userOrders = async (req, res) => {
    const { userId } = req.body;

    if (!userId) {
        return res.status(400).json({ success: false, message: "User ID is required." });
    }

    try {
        const orders = await orderModel.find({ userId });
        res.status(200).json({ success: true, data: orders });
    } catch (error) {
        console.error("Error fetching user orders:", error);
        res.status(500).json({ success: false, message: "An unexpected error occurred while fetching orders." });
    }
};

// Listing Orders for Admin Panel
const listOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({});
        res.status(200).json({ success: true, data: orders });
    } catch (error) {
        console.error("Error listing orders:", error);
        res.status(500).json({ success: false, message: "An unexpected error occurred while listing orders." });
    }
};

// api for updating order status
const updateStatus = async (req, res) => {
    const { orderId, status } = req.body;

    if (!orderId || !status) {
        return res.status(400).json({ success: false, message: "Order ID and status are required." });
    }

    try {
        const updatedOrder = await orderModel.findByIdAndUpdate(orderId, { status }, { new: true });
        if (!updatedOrder) {
            return res.status(404).json({ success: false, message: "Order not found." });
        }
        res.status(200).json({ success: true, message: "Order Status Updated" });
    } catch (error) {
        console.error("Error updating order status:", error);
        res.status(500).json({ success: false, message: "An unexpected error occurred while updating the status." });
    }
};

export { placeOrder, verifyOrder, userOrders, listOrders, updateStatus };
