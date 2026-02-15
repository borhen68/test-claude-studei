import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const FROM_EMAIL = 'Frametale <noreply@frametale.com>';

interface OrderConfirmationParams {
  to: string;
  orderId: string;
  bookTitle: string;
  total: number;
  shippingAddress: string;
}

/**
 * Send order confirmation email
 */
export async function sendOrderConfirmation(params: OrderConfirmationParams): Promise<void> {
  if (!resend) {
    console.warn('Resend not configured - email not sent');
    return;
  }

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: params.to,
      subject: `Order Confirmed - Your Frametale Book is Being Created! 📖`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { text-align: center; padding: 40px 0; background: linear-gradient(135deg, #f59e0b 0%, #ec4899 100%); color: white; border-radius: 10px; }
              .content { padding: 30px; background: #f9fafb; border-radius: 10px; margin: 20px 0; }
              .order-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
              .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
              .total { font-size: 20px; font-weight: bold; color: #ec4899; }
              .button { display: inline-block; background: linear-gradient(135deg, #f59e0b 0%, #ec4899 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; margin: 20px 0; }
              .footer { text-align: center; color: #6b7280; font-size: 14px; margin-top: 40px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🎉 Order Confirmed!</h1>
                <p>Your beautiful photo book is on its way</p>
              </div>

              <div class="content">
                <h2>Hi there!</h2>
                <p>Thank you for your order! We're thrilled to turn your memories into a beautiful keepsake.</p>

                <div class="order-details">
                  <h3>Order Details</h3>
                  <div class="detail-row">
                    <span>Order Number:</span>
                    <strong>#${params.orderId}</strong>
                  </div>
                  <div class="detail-row">
                    <span>Book Title:</span>
                    <strong>${params.bookTitle}</strong>
                  </div>
                  <div class="detail-row">
                    <span>Total:</span>
                    <span class="total">$${(params.total / 100).toFixed(2)}</span>
                  </div>
                </div>

                <h3>What's Next?</h3>
                <ol>
                  <li><strong>We're printing your book</strong> - This takes 2-3 business days</li>
                  <li><strong>Quality check</strong> - We inspect every page</li>
                  <li><strong>Shipping</strong> - Your book ships via USPS/UPS</li>
                  <li><strong>Delivery</strong> - Arrives in 5-7 business days</li>
                </ol>

                <div style="text-align: center;">
                  <a href="${process.env.NEXT_PUBLIC_APP_URL}/order/${params.orderId}/track" class="button">
                    Track Your Order
                  </a>
                </div>

                <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
                  <strong>📦 Shipping to:</strong><br>
                  ${params.shippingAddress}
                </div>

                <p>We'll send you another email with tracking information once your book ships!</p>
              </div>

              <div class="footer">
                <p>Questions? Reply to this email or visit our <a href="${process.env.NEXT_PUBLIC_APP_URL}/help">Help Center</a></p>
                <p>&copy; 2026 Frametale. Made with ❤️ for your memories.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });
  } catch (error) {
    console.error('Failed to send order confirmation:', error);
    // Don't throw - email failure shouldn't break the order flow
  }
}

interface ShippingNotificationParams {
  to: string;
  orderId: string;
  trackingNumber: string;
  trackingUrl: string;
  carrier: string;
}

/**
 * Send shipping notification
 */
export async function sendShippingNotification(params: ShippingNotificationParams): Promise<void> {
  if (!resend) {
    console.warn('Resend not configured - email not sent');
    return;
  }

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: params.to,
      subject: `Your Frametale Book Has Shipped! 📦`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { text-align: center; padding: 40px 0; background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); color: white; border-radius: 10px; }
              .content { padding: 30px; background: #f9fafb; border-radius: 10px; margin: 20px 0; }
              .tracking-box { background: white; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0; }
              .tracking-number { font-size: 24px; font-family: monospace; color: #3b82f6; font-weight: bold; margin: 10px 0; }
              .button { display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; margin: 20px 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>📦 Your Book is On the Way!</h1>
                <p>Track your package below</p>
              </div>

              <div class="content">
                <p>Great news! Your Frametale photo book has shipped and is heading your way.</p>

                <div class="tracking-box">
                  <strong>Tracking Number:</strong>
                  <div class="tracking-number">${params.trackingNumber}</div>
                  <p>Carrier: ${params.carrier}</p>
                  <a href="${params.trackingUrl}" class="button">Track Package</a>
                </div>

                <p><strong>Estimated delivery:</strong> 3-5 business days</p>
                
                <p>Your book was carefully printed, inspected, and packaged. We can't wait for you to see it!</p>

                <div style="background: #dbeafe; padding: 15px; border-radius: 8px; margin: 20px 0;">
                  <strong>💡 Tip:</strong> When your book arrives, let it sit flat for a few hours before opening - this helps the pages settle beautifully!
                </div>
              </div>
            </div>
          </body>
        </html>
      `,
    });
  } catch (error) {
    console.error('Failed to send shipping notification:', error);
  }
}
