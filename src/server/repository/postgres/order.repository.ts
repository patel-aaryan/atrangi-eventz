import { pool } from "@/server/config/postgres";
import type { CreateOrderData, Order } from "@/types/order";

/**
 * Order Repository - Handles all database operations for orders
 */
export class OrderRepository {
  /**
   * Create a new order
   * Returns the created order with auto-generated order_number
   */
  async create(data: CreateOrderData): Promise<Order> {
    const query = `
      INSERT INTO orders (
        subtotal,
        discount,
        processing_fee,
        total,
        currency,
        buyer_first_name,
        buyer_last_name,
        buyer_email,
        buyer_phone,
        billing_zip,
        billing_address,
        promo_code,
        discount_amount,
        stripe_payment_intent_id,
        stripe_charge_id,
        stripe_payment_method_id,
        stripe_customer_id,
        payment_status,
        status
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19
      )
      RETURNING *
    `;

    const values = [
      data.subtotal,
      data.discount,
      data.processingFee,
      data.total,
      data.currency || "CAD",
      data.buyerFirstName,
      data.buyerLastName,
      data.buyerEmail,
      data.buyerPhone || null,
      data.billingZip || null,
      data.billingAddress || null,
      data.promoCode || null,
      data.discountAmount || 0,
      data.stripePaymentIntentId || null,
      data.stripeChargeId || null,
      data.stripePaymentMethodId || null,
      data.stripeCustomerId || null,
      data.paymentStatus || "pending",
      "pending",
    ];

    const result = await pool.query(query, values);
    return this.mapRowToOrder(result.rows[0]);
  }

  /**
   * Find an order by ID
   */
  async findById(orderId: string): Promise<Order | null> {
    const query = `SELECT * FROM orders WHERE id = $1`;
    const result = await pool.query(query, [orderId]);

    if (result.rows.length === 0) {
      return null;
    }

    return this.mapRowToOrder(result.rows[0]);
  }

  /**
   * Find an order by order number
   */
  async findByOrderNumber(orderNumber: string): Promise<Order | null> {
    const query = `SELECT * FROM orders WHERE order_number = $1`;
    const result = await pool.query(query, [orderNumber]);

    if (result.rows.length === 0) {
      return null;
    }

    return this.mapRowToOrder(result.rows[0]);
  }

  /**
   * Update order status
   */
  async updateStatus(
    orderId: string,
    status: "pending" | "confirmed" | "cancelled" | "refunded"
  ): Promise<Order> {
    const query = `UPDATE orders SET status = $1 WHERE id = $2 RETURNING *`;
    const result = await pool.query(query, [status, orderId]);

    return this.mapRowToOrder(result.rows[0]);
  }

  /**
   * Update payment information
   */
  async updatePaymentInfo(
    orderId: string,
    paymentInfo: {
      stripeChargeId?: string;
      stripePaymentMethodId?: string;
      paymentStatus?: string;
    }
  ): Promise<Order> {
    const updates: string[] = [];
    const values: unknown[] = [];
    let paramIndex = 1;

    if (paymentInfo.stripeChargeId !== undefined) {
      updates.push(`stripe_charge_id = $${paramIndex++}`);
      values.push(paymentInfo.stripeChargeId);
    }
    if (paymentInfo.stripePaymentMethodId !== undefined) {
      updates.push(`stripe_payment_method_id = $${paramIndex++}`);
      values.push(paymentInfo.stripePaymentMethodId);
    }
    if (paymentInfo.paymentStatus !== undefined) {
      updates.push(`payment_status = $${paramIndex++}`);
      values.push(paymentInfo.paymentStatus);
    }

    if (updates.length === 0) {
      throw new Error("No payment info provided to update");
    }

    values.push(orderId);
    const query = `UPDATE orders SET ${updates.join(", ")} WHERE id = $${paramIndex} RETURNING *`;
    const result = await pool.query(query, values);

    return this.mapRowToOrder(result.rows[0]);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private mapRowToOrder(row: any): Order {
    return {
      id: row.id,
      order_number: row.order_number,
      subtotal: Number.parseFloat(row.subtotal),
      discount: Number.parseFloat(row.discount),
      processing_fee: Number.parseFloat(row.processing_fee),
      total: Number.parseFloat(row.total),
      currency: row.currency,
      buyer_first_name: row.buyer_first_name,
      buyer_last_name: row.buyer_last_name,
      buyer_email: row.buyer_email,
      buyer_phone: row.buyer_phone,
      billing_zip: row.billing_zip,
      billing_address: row.billing_address,
      promo_code: row.promo_code,
      discount_amount: Number.parseFloat(row.discount_amount),
      stripe_payment_intent_id: row.stripe_payment_intent_id,
      stripe_charge_id: row.stripe_charge_id,
      stripe_payment_method_id: row.stripe_payment_method_id,
      stripe_customer_id: row.stripe_customer_id,
      payment_status: row.payment_status,
      status: row.status,
      purchased_at: row.purchased_at,
      created_at: row.created_at,
      updated_at: row.updated_at,
    };
  }
}

