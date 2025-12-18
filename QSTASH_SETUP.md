# QStash Setup Guide

This project uses Upstash QStash to automatically clean up abandoned Stripe PaymentIntents when reservations expire.

## Overview

When a user creates a PaymentIntent but doesn't complete their purchase within 20 minutes, QStash automatically triggers a cleanup webhook that cancels the orphaned PaymentIntent in Stripe.

## Setup Instructions

### 1. Get QStash Credentials

1. Go to [Upstash Console](https://console.upstash.com/qstash)
2. Navigate to the QStash section
3. Copy the following credentials:
   - **QSTASH_TOKEN** - Used to publish messages
   - **QSTASH_CURRENT_SIGNING_KEY** - Used to verify webhook signatures
   - **QSTASH_NEXT_SIGNING_KEY** - Used during key rotation

### 2. Add Environment Variables

Add to your `.env.local` file:

```bash
# QStash
QSTASH_TOKEN=your_qstash_token_here
QSTASH_CURRENT_SIGNING_KEY=your_current_signing_key
QSTASH_NEXT_SIGNING_KEY=your_next_signing_key

# App URL (required for QStash webhook callback)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

For production (Vercel), add these to your Vercel environment variables:
- Set `NEXT_PUBLIC_APP_URL` to your production domain (e.g., `https://yourdomain.vercel.app`)

### 3. Verify Webhook Endpoint

The cleanup webhook is located at:
```
POST /api/stripe/cleanup-payment-intent
```

This endpoint is protected by QStash signature verification and can only be called by QStash.

## How It Works

### Flow Diagram

```
User loads payment page
  ↓
PaymentIntent created in Stripe
  ↓
QStash message scheduled (20 min delay)
  ↓
Message ID stored in Redis
  ↓
[Two possible paths:]
  
Path A: User completes payment
  ↓
QStash message cancelled
  ↓
PaymentIntent remains succeeded
  
Path B: User abandons (20 min pass)
  ↓
QStash delivers message to webhook
  ↓
Webhook cancels PaymentIntent in Stripe
```

### Key Components

1. **QStashService** (`src/server/services/qstash.service.ts`)
   - `schedulePaymentCleanup()` - Schedules cleanup message
   - `cancelPaymentCleanup()` - Cancels scheduled message on successful payment

2. **Cleanup Webhook** (`src/app/api/stripe/cleanup-payment-intent/route.ts`)
   - Verifies QStash signature
   - Checks PaymentIntent status
   - Cancels if still in cancelable state

3. **Integration Points**
   - `create-payment-intent` route - Schedules cleanup
   - `purchase/complete` route - Cancels cleanup on success

## Testing

### Local Testing

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Create a PaymentIntent by navigating to the payment page

3. Check the console logs:
   ```
   [QStash] Scheduled cleanup for PaymentIntent pi_xxx, messageId: msg_xxx
   ```

4. View scheduled messages in [Upstash Console](https://console.upstash.com/qstash) under "Messages"

5. For faster testing, temporarily reduce `RESERVATION_TTL` in `qstash.service.ts`:
   ```typescript
   const RESERVATION_TTL = 60; // 1 minute for testing
   ```

### Testing Successful Payment Flow

1. Create a PaymentIntent
2. Complete the payment
3. Check console for cancellation log:
   ```
   [QStash] Cancelled cleanup for PaymentIntent pi_xxx, messageId: msg_xxx
   ```
4. Verify the message is removed from QStash Console

### Testing Abandoned Payment Flow

1. Create a PaymentIntent
2. Wait for the delay period (20 minutes or your test duration)
3. QStash will call your webhook
4. Check webhook logs:
   ```
   [Cleanup] Processing cleanup for PaymentIntent: pi_xxx
   [Cleanup] Cancelled orphaned PaymentIntent: pi_xxx
   ```
5. Verify PaymentIntent is cancelled in Stripe Dashboard

## Monitoring

### QStash Console
- View all scheduled messages
- See delivery status and retries
- Monitor webhook responses

### Vercel Logs
- Filter for "[QStash]" to see scheduling/cancellation
- Filter for "[Cleanup]" to see webhook execution

### Stripe Dashboard
- Check PaymentIntent status
- Verify cancellations are happening

## Troubleshooting

### Issue: Webhook returns 401 Unauthorized
**Cause:** Missing or incorrect signing keys
**Solution:** Verify `QSTASH_CURRENT_SIGNING_KEY` and `QSTASH_NEXT_SIGNING_KEY` in environment variables

### Issue: Messages not being delivered
**Cause:** Incorrect `NEXT_PUBLIC_APP_URL` or unreachable webhook
**Solution:** 
- Verify URL is publicly accessible (use ngrok for local testing)
- Check QStash Console for delivery errors

### Issue: PaymentIntents not being cancelled
**Cause:** PaymentIntent already in non-cancelable state
**Solution:** This is expected behavior. The webhook will log the status and skip cancellation.

### Issue: Hit QStash free tier limit (1,000 messages/day)
**Cause:** High volume of abandoned checkouts
**Solution:**
- Review checkout flow for UX issues
- Consider upgrading to QStash paid plan ($10/mo for 10,000 messages)
- Or switch to Vercel Cron approach (see alternative plans)

## Cost Considerations

- **Free Tier:** 1,000 messages/day
- Only abandoned checkouts consume messages (successful payments cancel before delivery)
- Average abandonment rate: 20-30%
- Estimated capacity: ~3,000-5,000 checkouts/day on free tier

## Security

- Webhook endpoint is protected by QStash signature verification
- Only requests signed by QStash are processed
- Direct calls to the webhook endpoint will fail with 401

## Additional Resources

- [QStash Documentation](https://upstash.com/docs/qstash)
- [QStash Webhook Verification](https://upstash.com/docs/qstash/features/security)
- [Stripe PaymentIntent API](https://stripe.com/docs/api/payment_intents)

