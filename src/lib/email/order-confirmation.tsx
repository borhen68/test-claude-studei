import React from 'react';

interface OrderConfirmationEmailProps {
  orderNumber: string;
  customerName: string;
  orderTotal: number;
  estimatedDelivery: string;
  config: {
    size: string;
    paperType: string;
    coverType: string;
    quantity: number;
  };
  shipping: {
    address: string;
    city: string;
    state: string;
    zip: string;
  };
}

export const OrderConfirmationEmail: React.FC<OrderConfirmationEmailProps> = ({
  orderNumber,
  customerName,
  orderTotal,
  estimatedDelivery,
  config,
  shipping,
}) => {
  const formatPrice = (cents: number) => `$${(cents / 100).toFixed(2)}`;
  const firstName = customerName.split(' ')[0];

  return (
    <div style={{ 
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      maxWidth: '600px',
      margin: '0 auto',
      backgroundColor: '#ffffff'
    }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #f59e0b 0%, #ec4899 100%)',
        padding: '40px 20px',
        textAlign: 'center'
      }}>
        <h1 style={{ 
          color: '#ffffff',
          fontSize: '32px',
          margin: '0 0 10px 0',
          fontWeight: 'bold'
        }}>
          Order Confirmed! 🎉
        </h1>
        <p style={{
          color: 'rgba(255, 255, 255, 0.9)',
          fontSize: '16px',
          margin: 0
        }}>
          Thank you for your order, {firstName}!
        </p>
      </div>

      {/* Content */}
      <div style={{ padding: '40px 20px' }}>
        {/* Order Number */}
        <div style={{
          backgroundColor: '#fef3c7',
          border: '2px solid #fbbf24',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '30px',
          textAlign: 'center'
        }}>
          <p style={{
            fontSize: '14px',
            color: '#92400e',
            margin: '0 0 5px 0',
            fontWeight: '600'
          }}>
            Order Number
          </p>
          <p style={{
            fontSize: '24px',
            color: '#92400e',
            margin: 0,
            fontWeight: 'bold',
            fontFamily: 'monospace'
          }}>
            #{orderNumber}
          </p>
        </div>

        {/* What's Next */}
        <h2 style={{
          fontSize: '20px',
          color: '#111827',
          marginBottom: '20px',
          fontWeight: 'bold'
        }}>
          What's Next?
        </h2>

        <div style={{ marginBottom: '30px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tr>
              <td style={{ padding: '15px 0', borderBottom: '1px solid #e5e7eb' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: '#10b981',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '15px',
                    flexShrink: 0
                  }}>
                    <span style={{ color: '#ffffff', fontSize: '20px' }}>✓</span>
                  </div>
                  <div>
                    <p style={{ margin: '0 0 5px 0', fontWeight: '600', color: '#111827' }}>
                      Order Placed
                    </p>
                    <p style={{ margin: 0, fontSize: '14px', color: '#6b7280' }}>
                      Your order has been confirmed
                    </p>
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <td style={{ padding: '15px 0', borderBottom: '1px solid #e5e7eb' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: '#f59e0b',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '15px',
                    flexShrink: 0
                  }}>
                    <span style={{ color: '#ffffff', fontSize: '20px' }}>📦</span>
                  </div>
                  <div>
                    <p style={{ margin: '0 0 5px 0', fontWeight: '600', color: '#111827' }}>
                      Processing & Printing
                    </p>
                    <p style={{ margin: 0, fontSize: '14px', color: '#6b7280' }}>
                      We're creating your beautiful book
                    </p>
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <td style={{ padding: '15px 0', borderBottom: '1px solid #e5e7eb' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: '#3b82f6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '15px',
                    flexShrink: 0
                  }}>
                    <span style={{ color: '#ffffff', fontSize: '20px' }}>🚚</span>
                  </div>
                  <div>
                    <p style={{ margin: '0 0 5px 0', fontWeight: '600', color: '#111827' }}>
                      Shipped
                    </p>
                    <p style={{ margin: 0, fontSize: '14px', color: '#6b7280' }}>
                      You'll receive tracking information
                    </p>
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <td style={{ padding: '15px 0' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: '#8b5cf6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '15px',
                    flexShrink: 0
                  }}>
                    <span style={{ color: '#ffffff', fontSize: '20px' }}>🏠</span>
                  </div>
                  <div>
                    <p style={{ margin: '0 0 5px 0', fontWeight: '600', color: '#111827' }}>
                      Estimated Delivery
                    </p>
                    <p style={{ margin: 0, fontSize: '14px', color: '#6b7280' }}>
                      {new Date(estimatedDelivery).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </td>
            </tr>
          </table>
        </div>

        {/* Order Summary */}
        <div style={{
          backgroundColor: '#f9fafb',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '30px'
        }}>
          <h3 style={{
            fontSize: '18px',
            color: '#111827',
            marginBottom: '15px',
            fontWeight: 'bold'
          }}>
            Order Summary
          </h3>

          <table style={{ width: '100%', fontSize: '14px' }}>
            <tr>
              <td style={{ padding: '8px 0', color: '#6b7280' }}>Size:</td>
              <td style={{ padding: '8px 0', color: '#111827', fontWeight: '600', textAlign: 'right' }}>
                {config.size}
              </td>
            </tr>
            <tr>
              <td style={{ padding: '8px 0', color: '#6b7280' }}>Paper:</td>
              <td style={{ padding: '8px 0', color: '#111827', fontWeight: '600', textAlign: 'right' }}>
                {config.paperType}
              </td>
            </tr>
            <tr>
              <td style={{ padding: '8px 0', color: '#6b7280' }}>Cover:</td>
              <td style={{ padding: '8px 0', color: '#111827', fontWeight: '600', textAlign: 'right' }}>
                {config.coverType}
              </td>
            </tr>
            <tr>
              <td style={{ padding: '8px 0', color: '#6b7280' }}>Quantity:</td>
              <td style={{ padding: '8px 0', color: '#111827', fontWeight: '600', textAlign: 'right' }}>
                {config.quantity}
              </td>
            </tr>
            <tr>
              <td colSpan={2} style={{ paddingTop: '15px', borderTop: '2px solid #e5e7eb' }} />
            </tr>
            <tr>
              <td style={{ padding: '15px 0 0 0', fontSize: '16px', fontWeight: 'bold', color: '#111827' }}>
                Total:
              </td>
              <td style={{ 
                padding: '15px 0 0 0', 
                fontSize: '20px', 
                fontWeight: 'bold', 
                color: '#10b981',
                textAlign: 'right'
              }}>
                {formatPrice(orderTotal)}
              </td>
            </tr>
          </table>
        </div>

        {/* Shipping Address */}
        <div style={{
          backgroundColor: '#f9fafb',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '30px'
        }}>
          <h3 style={{
            fontSize: '18px',
            color: '#111827',
            marginBottom: '10px',
            fontWeight: 'bold'
          }}>
            Shipping Address
          </h3>
          <p style={{ margin: 0, fontSize: '14px', color: '#6b7280', lineHeight: '1.6' }}>
            {customerName}<br />
            {shipping.address}<br />
            {shipping.city}, {shipping.state} {shipping.zip}
          </p>
        </div>

        {/* CTA Button */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <a
            href="https://frametale.com/dashboard"
            style={{
              display: 'inline-block',
              background: 'linear-gradient(135deg, #f59e0b 0%, #ec4899 100%)',
              color: '#ffffff',
              padding: '15px 40px',
              borderRadius: '50px',
              textDecoration: 'none',
              fontWeight: 'bold',
              fontSize: '16px'
            }}
          >
            View Order Status
          </a>
        </div>

        {/* Help */}
        <div style={{
          textAlign: 'center',
          fontSize: '14px',
          color: '#6b7280',
          marginTop: '40px'
        }}>
          <p>Questions about your order?</p>
          <p>
            <a href="mailto:support@frametale.com" style={{ color: '#f59e0b', textDecoration: 'none' }}>
              Contact Support
            </a>
          </p>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        backgroundColor: '#f9fafb',
        padding: '30px 20px',
        textAlign: 'center',
        fontSize: '12px',
        color: '#9ca3af'
      }}>
        <p style={{ margin: '0 0 10px 0' }}>
          Made with ❤️ by Frametale
        </p>
        <p style={{ margin: 0 }}>
          © 2026 Frametale. All rights reserved.
        </p>
      </div>
    </div>
  );
};

// Plain text version for email clients that don't support HTML
export const orderConfirmationText = ({
  orderNumber,
  customerName,
  orderTotal,
  estimatedDelivery,
  config,
  shipping,
}: OrderConfirmationEmailProps) => {
  const formatPrice = (cents: number) => `$${(cents / 100).toFixed(2)}`;
  const firstName = customerName.split(' ')[0];

  return `
Order Confirmed! 🎉

Thank you for your order, ${firstName}!

Order Number: #${orderNumber}

What's Next?
✓ Order Placed - Your order has been confirmed
📦 Processing & Printing - We're creating your beautiful book
🚚 Shipped - You'll receive tracking information
🏠 Estimated Delivery: ${new Date(estimatedDelivery).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })}

Order Summary:
Size: ${config.size}
Paper: ${config.paperType}
Cover: ${config.coverType}
Quantity: ${config.quantity}
Total: ${formatPrice(orderTotal)}

Shipping Address:
${customerName}
${shipping.address}
${shipping.city}, ${shipping.state} ${shipping.zip}

View your order status: https://frametale.com/dashboard

Questions? Contact us at support@frametale.com

Made with ❤️ by Frametale
© 2026 Frametale. All rights reserved.
`.trim();
};
