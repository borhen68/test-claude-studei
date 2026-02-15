import { Section, Text, Button, Row, Column, Hr } from '@react-email/components';
import * as React from 'react';
import { BaseLayout } from './base-layout';

export const OrderConfirmation = ({ orderId, bookTitle, subtotal, shippingCost, tax, total, shippingAddress, unsubscribeUrl }: any) => (
  <BaseLayout preview={`Order confirmed! "${bookTitle}"`} unsubscribeUrl={unsubscribeUrl}>
    <Section style={{padding:'30px 40px'}}>
      <Text style={{fontSize:'32px',fontWeight:'700',textAlign:'center' as const}}>🎉 Order Confirmed!</Text>
      <Section style={{backgroundColor:'#fef3c7',padding:'20px',borderRadius:'8px',textAlign:'center' as const,margin:'20px 0'}}>
        <Text style={{fontSize:'28px',fontWeight:'bold',fontFamily:'monospace'}}>#{orderId.slice(0,8)}</Text>
      </Section>
      <Hr />
      <Row><Column>Book:</Column><Column style={{textAlign:'right' as const}}>{bookTitle}</Column></Row>
      <Row><Column>Subtotal:</Column><Column style={{textAlign:'right' as const}}>${(subtotal/100).toFixed(2)}</Column></Row>
      <Row><Column>Shipping:</Column><Column style={{textAlign:'right' as const}}>${(shippingCost/100).toFixed(2)}</Column></Row>
      <Row><Column style={{fontWeight:'600'}}>Total:</Column><Column style={{textAlign:'right' as const,fontSize:'24px',color:'#ec4899',fontWeight:'bold'}}>${(total/100).toFixed(2)}</Column></Row>
      <Section style={{textAlign:'center' as const,margin:'30px 0'}}>
        <Button style={{backgroundColor:'#ec4899',borderRadius:'25px',color:'#fff',padding:'14px 40px'}} href={`${process.env.NEXT_PUBLIC_APP_URL}/orders/${orderId}`}>
          Track Your Order
        </Button>
      </Section>
    </Section>
  </BaseLayout>
);

export default OrderConfirmation;
