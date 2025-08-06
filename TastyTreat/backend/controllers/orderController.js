import orderModel from "../models/orderModel.js"
import userModel from "../models/userModel.js"
import Razorpay from "razorpay"

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_dummy_key',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummy_secret'
})

// placing user order from frontend
const placeOrder = async (req, res) => {

    let URL = process.env.URL;
    console.log("Original URL from env:", URL);

    if (!URL) {
        URL = "http://localhost:5173";
        console.log("Fallback URL used:", URL);
    } else if (!URL.match(/^https?:\/\//)) {
        URL = "http://" + URL;
        console.log("Updated URL with scheme:", URL);
    }

    try {
        const newOrder = new orderModel({
            userId: req.body.userId,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address,
            discount: req.body.discount,
            delivery: req.body.delivery,
            paymentMethod: req.body.paymentMethod || "stripe"
        })
        await newOrder.save();
        await userModel.findByIdAndUpdate(req.body.userId, {cartData:{}});

        if (req.body.paymentMethod === "cod") {
            // For Cash on Delivery, no Razorpay order, payment false
            return res.json({success:true, message:"Order placed with Cash on Delivery"});
        }

        if (req.body.paymentMethod === "upi") {
            // For UPI payment, create Razorpay order
            const amount = Math.max(1, Math.floor((req.body.amount + req.body.delivery - req.body.discount) * 100));
            
            const options = {
                amount: amount,
                currency: "INR",
                receipt: newOrder._id.toString(),
                notes: {
                    order_id: newOrder._id.toString(),
                    discount: req.body.discount.toString()
                }
            };

            const order = await razorpay.orders.create(options);
            
            res.json({
                success: true,
                order_id: order.id,
                amount: order.amount,
                currency: order.currency,
                orderId: newOrder._id
            });
        } else {
            // Default to Razorpay for other payment methods
            const amount = Math.max(1, Math.floor((req.body.amount + req.body.delivery - req.body.discount) * 100));
            
            const options = {
                amount: amount,
                currency: "INR",
                receipt: newOrder._id.toString(),
                notes: {
                    order_id: newOrder._id.toString(),
                    discount: req.body.discount.toString()
                }
            };

            const order = await razorpay.orders.create(options);
            
            res.json({
                success: true,
                order_id: order.id,
                amount: order.amount,
                currency: order.currency,
                orderId: newOrder._id
            });
        }
    } catch (error) {
        console.error("Backend placeOrder error:", error);
        res.json({success:false, message:error.message || "Error"})
    }
}

const verifyOrder = async (req, res) => {
    const {orderId, success} = req.body;
    try {
        if (success) {
            await orderModel.findByIdAndUpdate(orderId, {payment: true})
            res.json({success:true, message:"Paid"})
        }
        else {
            await orderModel.findByIdAndDelete(orderId)
            res.json({success:false, message:"Not paid, failed"})
        }
    } catch (error) {
        console.log(error);
        res.json({success:false, message:"Error"})
    }
}

// users orders for frontend
const userOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({userId:req.body.userId})
        res.json({success:true, data:orders})
    } catch (error) {
        console.log(error);
        res.json({success:false, message:"Error"})
    }
}

// listing orders for admin
const listOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({});
        res.json({success:true, data:orders})
    } catch (error) {
        console.log(error);
        res.json({success:true, message:"Error"})
    }
}

// api for updating order status
const updateStatus = async (req, res) => {
    try {
        await orderModel.findByIdAndUpdate(req.body.orderId, {status: req.body.status})
        res.json({success:true, message:"Status updated"})
    } catch (error) {
        console.log(error);
        res.json({success:false, message:"Error"})
    }
}

const deleteOrder = async (req, res) => {
    try {
        const orderId = req.params.id;
        await orderModel.findByIdAndDelete(orderId);
        res.json({success: true, message: "Order deleted successfully"});
    } catch (error) {
        console.log(error);
        res.json({success: false, message: "Error deleting order"});
    }
}

export {placeOrder, verifyOrder, userOrders, listOrders, updateStatus, deleteOrder}
