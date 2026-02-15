import { Section, Text, Button, CodeBlock } from '@react-email/components';
import * as React from 'react';
import { BaseLayout } from './base-layout';

export const OrderShipped = ({ trackingNumber, trackingUrl, carrier, unsubscribeUrl }: any) => (
  <BaseLayout preview="Your book has shipped!" unsubscribeUrl={unsubscribeUrl}>
    <Section style={{padding:'30px 40px'}}>
      <Text style={{fontSize:'32px',fontWeight:'700',textAlign:'center' as const}}>📦 Your Book Has Shipped!</Text>
      <Section style={{backgroundColor:'#f0f9ff',padding:'30px 20px',borderRadius:'12px',textAlign:'center' as const,margin:'20px 0',border:'2px solid #3b82f6'}}>
        <CodeBlock style={{backgroundColor:'#ffffff',padding:'16px 24px',borderRadius:'8px',fontSize:'20px',fontWeight:'bold',letterSpacing:'2px'}}>{trackingNumber}</CodeBlock>
        <Text style={{fontSize:'14px',color:'#6b7280',margin:'12px 0 0'}}>Carrier: {carrier}</Text>
      </Section>
      <Section style={{textAlign:'center' as const,margin:'30px 0'}}>
        <Button style={{backgroundColor:'#3b82f6',borderRadius:'25px',color:'#fff',padding:'14px 40px'}} href={trackingUrl}>
          Track Package
        </Button>
      </Section>
    </Section>
  </BaseLayout>
);

export default OrderShipped;
