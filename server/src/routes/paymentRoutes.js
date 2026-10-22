import express from 'express';
import { createOrder, verifyPayment } from '../controllers/paymentController.js';

const router = express.Router();

// POST /api/payment/create-order  — creates a Razorpay order (server-side)
router.post('/create-order', createOrder);

// POST /api/payment/verify  — verifies HMAC signature after client-side payment
router.post('/verify', verifyPayment);

export default router;
