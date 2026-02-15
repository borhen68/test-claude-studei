import { Section, Text, Button, Code } from '@react-email/components';
import * as React from 'react';
import { BaseLayout } from './base-layout';

interface OrderShippedProps {
  orderId: string;
  orderNumber?: string;
  trackingNumber: string;
  trackingUrl: string;
  carrier: string;
  estimatedDelivery?: string;
  unsubscribeUrl?: string;
}

export const OrderShipped = ({
  orderId,
  orderNumber,
  trackingNumber,
  trackingUrl,
  carrier,
  estimatedDelivery,
  unsubscribeUrl,
}: OrderShippedProps) => {
  const displayOrderNumber = orderNumber || orderId.slice(0, 8).toUpperCase();
  const delivery = estimatedDelivery || '3-5 business days';
  
  return (
    <BaseLayout 
      preview="Your Frametale book has shipped! Track your package."
      unsubscribeUrl={unsubscribeUrl}
    >
      <Section style={content}>
        <Text style={heading}>📦 Your Book Has Shipped!</Text>
        
        <Text style={subheading}>Track your package below</Text>

        <Section style={trackingBox}>
          <Text style={trackingLabel}>Tracking Number</Text>
          <Code style={trackingNumber}>{trackingNumber}</Code>
          <Text style={carrierText}>Carrier: {carrier}</Text>
        </Section>

        <Section style={buttonContainer}>
          <Button style={button} href={trackingUrl}>
            Track Package
          </Button>
        </Section>

        <Section style={infoBox}>
          <Text style={infoTitle}>📅 Estimated Delivery</Text>
          <Text style={infoText}>{delivery}</Text>
        </Section>

        <Text style={paragraph}>
          Your book was carefully printed, inspected, and packaged. We can't wait for you to see it!
        </Text>

        <Section style={tipBox}>
          <Text style={tipTitle}>💡 Tip</Text>
          <Text style={tipText}>
            When your book arrives, let it sit flat for a few hours before opening. 
            This helps the pages settle beautifully!
          </Text>
        </Section>

        <Text style={paragraph}>
          <strong>Order #{displayOrderNumber}</strong>
        </Text>

        <Text style={paragraph}>
          Questions about your shipment? Reply to this email and we'll help you out!
        </Text>
      </Section>
    </BaseLayout>
  );
};

export default OrderShipped;

const content = {
  padding: '30px 40px',
};

const heading = {
  fontSize: '32px',
  lineHeight: '1.3',
  fontWeight: '700',
  color: '#1f2937',
  textAlign: 'center' as const,
  margin: '0 0 10px',
};

const subheading = {
  fontSize: '16px',
  lineHeight: '24px',
  color: '#6b7280',
  textAlign: 'center' as const,
  margin: '0 0 30px',
};

const paragraph = {
  fontSize: '16px',
  lineHeight: '26px',
  color: '#374151',
  margin: '16px 0',
  textAlign: 'center' as const,
};

const trackingBox = {
  backgroundColor: '#f0f9ff',
  padding: '30px 20px',
  borderRadius: '12px',
  textAlign: 'center' as const,
  margin: '20px 0',
  border: '2px solid #3b82f6',
};

const trackingLabel = {
  fontSize: '14px',
  color: '#1e40af',
  margin: '0 0 12px',
  fontWeight: '600',
};

const trackingNumber = {
  backgroundColor: '#ffffff',
  padding: '16px 24px',
  borderRadius: '8px',
  fontSize: '20px',
  fontWeight: 'bold',
  letterSpacing: '2px',
  color: '#1f2937',
  fontFamily: 'monospace',
  display: 'inline-block',
  margin: '0',
};

const carrierText = {
  fontSize: '14px',
  color: '#6b7280',
  margin: '12px 0 0',
};

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '30px 0',
};

const button = {
  backgroundColor: '#3b82f6',
  borderRadius: '25px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '14px 40px',
};

const infoBox = {
  backgroundColor: '#f9fafb',
  padding: '20px',
  borderRadius: '8px',
  textAlign: 'center' as const,
  margin: '20px 0',
};

const infoTitle = {
  fontSize: '16px',
  fontWeight: '600',
  color: '#1f2937',
  margin: '0 0 8px',
};

const infoText = {
  fontSize: '18px',
  color: '#3b82f6',
  fontWeight: '600',
  margin: '0',
};

const tipBox = {
  backgroundColor: '#dbeafe',
  padding: '20px',
  borderRadius: '8px',
  margin: '30px 0',
};

const tipTitle = {
  fontSize: '16px',
  fontWeight: '600',
  color: '#1e40af',
  margin: '0 0 8px',
};

const tipText = {
  fontSize: '14px',
  lineHeight: '22px',
  color: '#1e40af',
  margin: '0',
};
