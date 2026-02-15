import { Section, Text, Button, Row, Column, Hr } from '@react-email/components';
import * as React from 'react';
import { BaseLayout } from './base-layout';

interface OrderConfirmationProps {
  orderId: string;
  orderNumber?: string;
  bookTitle: string;
  pageCount?: number;
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
  shippingAddress: {
    name: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  estimatedDelivery?: string;
  unsubscribeUrl?: string;
}

export const OrderConfirmation = ({
  orderId,
  orderNumber,
  bookTitle,
  pageCount,
  subtotal,
  shippingCost,
  tax,
  total,
  shippingAddress,
  estimatedDelivery,
  unsubscribeUrl,
}: OrderConfirmationProps) => {
  const displayOrderNumber = orderNumber || orderId.slice(0, 8).toUpperCase();
  const delivery = estimatedDelivery || '7-10 business days';
  
  return (
    <BaseLayout 
      preview={`Order confirmed! Your photo book "${bookTitle}" is being created.`}
      unsubscribeUrl={unsubscribeUrl}
    >
      <Section style={content}>
        <Text style={heading}>🎉 Order Confirmed!</Text>
        
        <Text style={subheading}>Your beautiful photo book is on its way</Text>

        <Section style={orderBox}>
          <Text style={orderLabel}>Order Number</Text>
          <Text style={orderNumber}>#{displayOrderNumber}</Text>
        </Section>

        <Hr style={hr} />

        <Text style={sectionTitle}>Order Details</Text>
        
        <Row style={detailRow}>
          <Column style={detailLabel}>Book Title:</Column>
          <Column style={detailValue}>{bookTitle}</Column>
        </Row>
        
        {pageCount && (
          <Row style={detailRow}>
            <Column style={detailLabel}>Pages:</Column>
            <Column style={detailValue}>{pageCount} pages</Column>
          </Row>
        )}
        
        <Row style={detailRow}>
          <Column style={detailLabel}>Subtotal:</Column>
          <Column style={detailValue}>${(subtotal / 100).toFixed(2)}</Column>
        </Row>
        
        {shippingCost > 0 && (
          <Row style={detailRow}>
            <Column style={detailLabel}>Shipping:</Column>
            <Column style={detailValue}>${(shippingCost / 100).toFixed(2)}</Column>
          </Row>
        )}
        
        {tax > 0 && (
          <Row style={detailRow}>
            <Column style={detailLabel}>Tax:</Column>
            <Column style={detailValue}>${(tax / 100).toFixed(2)}</Column>
          </Row>
        )}
        
        <Hr style={hr} />
        
        <Row style={totalRow}>
          <Column style={totalLabel}>Total:</Column>
          <Column style={totalValue}>${(total / 100).toFixed(2)}</Column>
        </Row>

        <Hr style={hr} />

        <Text style={sectionTitle}>What's Next?</Text>
        
        <Text style={stepItem}>1️⃣ <strong>Printing</strong> - We're creating your book (2-3 business days)</Text>
        <Text style={stepItem}>2️⃣ <strong>Quality Check</strong> - Every page is inspected</Text>
        <Text style={stepItem}>3️⃣ <strong>Shipping</strong> - Your book ships via USPS/UPS</Text>
        <Text style={stepItem}>4️⃣ <strong>Delivery</strong> - Arrives in {delivery}</Text>

        <Section style={buttonContainer}>
          <Button style={button} href={`${process.env.NEXT_PUBLIC_APP_URL}/orders/${orderId}`}>
            Track Your Order
          </Button>
        </Section>

        <Section style={addressBox}>
          <Text style={addressTitle}>📦 Shipping Address</Text>
          <Text style={addressText}>
            {shippingAddress.name}<br />
            {shippingAddress.line1}<br />
            {shippingAddress.line2 && <>{shippingAddress.line2}<br /></>}
            {shippingAddress.city}, {shippingAddress.state} {shippingAddress.zip}<br />
            {shippingAddress.country}
          </Text>
        </Section>

        <Section style={infoBox}>
          <Text style={infoText}>
            We'll send you another email with tracking information once your book ships!
          </Text>
        </Section>
      </Section>
    </BaseLayout>
  );
};

export default OrderConfirmation;

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

const sectionTitle = {
  fontSize: '20px',
  fontWeight: '600',
  color: '#1f2937',
  margin: '24px 0 16px',
};

const orderBox = {
  backgroundColor: '#fef3c7',
  padding: '20px',
  borderRadius: '8px',
  textAlign: 'center' as const,
  margin: '20px 0',
};

const orderLabel = {
  fontSize: '14px',
  color: '#92400e',
  margin: '0 0 8px',
};

const orderNumber = {
  fontSize: '28px',
  fontWeight: 'bold',
  color: '#1f2937',
  fontFamily: 'monospace',
  margin: '0',
};

const detailRow = {
  margin: '12px 0',
};

const detailLabel = {
  fontSize: '16px',
  color: '#6b7280',
  width: '40%',
};

const detailValue = {
  fontSize: '16px',
  color: '#1f2937',
  fontWeight: '500',
  textAlign: 'right' as const,
  width: '60%',
};

const totalRow = {
  margin: '16px 0',
};

const totalLabel = {
  fontSize: '20px',
  color: '#1f2937',
  fontWeight: '600',
  width: '40%',
};

const totalValue = {
  fontSize: '24px',
  color: '#ec4899',
  fontWeight: 'bold',
  textAlign: 'right' as const,
  width: '60%',
};

const stepItem = {
  fontSize: '16px',
  lineHeight: '26px',
  color: '#374151',
  margin: '12px 0',
};

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '30px 0',
};

const button = {
  backgroundColor: '#ec4899',
  borderRadius: '25px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '14px 40px',
};

const addressBox = {
  backgroundColor: '#f9fafb',
  padding: '20px',
  borderRadius: '8px',
  margin: '20px 0',
};

const addressTitle = {
  fontSize: '16px',
  fontWeight: '600',
  color: '#1f2937',
  margin: '0 0 12px',
};

const addressText = {
  fontSize: '16px',
  lineHeight: '24px',
  color: '#374151',
  margin: '0',
};

const infoBox = {
  backgroundColor: '#dbeafe',
  padding: '16px',
  borderRadius: '8px',
  margin: '30px 0',
  textAlign: 'center' as const,
};

const infoText = {
  fontSize: '14px',
  lineHeight: '22px',
  color: '#1e40af',
  margin: '0',
};

const hr = {
  borderColor: '#e5e7eb',
  margin: '20px 0',
};
