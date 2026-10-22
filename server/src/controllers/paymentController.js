import Razorpay from 'razorpay';
import crypto from 'crypto';
import { query } from '../db/index.js';

// Initialize Razorpay instance with env keys
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Registration fee in paise (default ₹499 = 49900 paise)
const REGISTRATION_FEE = parseInt(process.env.RAZORPAY_REGISTRATION_FEE || '49900', 10);

// ==========================================
// CREATE ORDER
// POST /api/payment/create-order
// Body: { caseReference, customerName, customerEmail, customerPhone }
// ==========================================
export const createOrder = async (req, res) => {
  try {
    const { caseReference, customerName, customerEmail, customerPhone } = req.body;

    if (!caseReference) {
      return res.status(400).json({ success: false, message: 'caseReference is required' });
    }

    const options = {
      amount: REGISTRATION_FEE,         // amount in paise
      currency: 'INR',
      receipt: `receipt_${caseReference}`,
      notes: {
        caseReference,
        customerName: customerName || '',
        customerEmail: customerEmail || '',
        customerPhone: customerPhone || ''
      }
    };

    const order = await razorpay.orders.create(options);

    return res.status(201).json({
      success: true,
      order,
      keyId: process.env.RAZORPAY_KEY_ID,
      amount: REGISTRATION_FEE,
      currency: 'INR'
    });
  } catch (error) {
    console.error('Razorpay create-order error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// VERIFY PAYMENT SIGNATURE
// POST /api/payment/verify
// Body: { razorpay_order_id, razorpay_payment_id, razorpay_signature, caseReference }
// ==========================================
export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      caseReference
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Missing payment verification fields' });
    }

    // Verify HMAC-SHA256 signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    const isValid = expectedSignature === razorpay_signature;

    if (!isValid) {
      return res.status(400).json({ success: false, message: 'Payment signature verification failed' });
    }

    // Update case in DB with payment info
    if (caseReference) {
      await query(
        `UPDATE cases 
         SET payment_status = 'paid',
             payment_id = $1,
             payment_order_id = $2,
             payment_amount = $3,
             paid_at = NOW()
         WHERE case_reference = $4`,
        [razorpay_payment_id, razorpay_order_id, REGISTRATION_FEE / 100, caseReference]
      ).catch(err => {
        // Column might not exist yet — non-blocking, migration handles it
        console.warn('Payment columns update skipped (migration pending):', err.message);
      });
    }

    return res.json({
      success: true,
      message: 'Payment verified successfully',
      paymentId: razorpay_payment_id
    });
  } catch (error) {
    console.error('Razorpay verify-payment error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
