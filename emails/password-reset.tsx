import { Section, Text, Button } from '@react-email/components';
import * as React from 'react';
import { BaseLayout } from './base-layout';

export const PasswordReset = ({ resetUrl, expiryHours = 1 }: any) => (
  <BaseLayout preview="Reset your password">
    <Section style={{padding:'30px 40px'}}>
      <Text style={{fontSize:'32px',fontWeight:'700',textAlign:'center' as const}}>🔑 Reset Your Password</Text>
      <Text style={{fontSize:'16px',textAlign:'center' as const,margin:'16px 0'}}>
        Click the button below to create a new password.
      </Text>
      <Section style={{textAlign:'center' as const,margin:'30px 0'}}>
        <Button style={{backgroundColor:'#dc2626',borderRadius:'25px',color:'#fff',padding:'14px 40px'}} href={resetUrl}>
          Reset Password
        </Button>
      </Section>
      <Section style={{backgroundColor:'#fef3c7',padding:'16px',borderRadius:'8px',textAlign:'center' as const}}>
        <Text style={{fontSize:'14px',color:'#92400e',margin:'0'}}>⏰ This link expires in {expiryHours} hour(s)</Text>
      </Section>
    </Section>
  </BaseLayout>
);

export default PasswordReset;
