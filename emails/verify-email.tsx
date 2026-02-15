import { Section, Text, Button, Code } from '@react-email/components';
import * as React from 'react';
import { BaseLayout } from './base-layout';

interface VerifyEmailProps {
  verifyUrl: string;
  verifyCode?: string;
}

export const VerifyEmail = ({ verifyUrl, verifyCode }: VerifyEmailProps) => {
  return (
    <BaseLayout preview="Verify your email address">
      <Section style={{padding:'30px 40px'}}>
        <Text style={{fontSize:'32px',fontWeight:'700',textAlign:'center' as const}}>✉️ Verify Your Email</Text>
        <Section style={{textAlign:'center' as const,margin:'30px 0'}}>
          <Button style={{backgroundColor:'#3b82f6',borderRadius:'25px',color:'#fff',fontSize:'16px',fontWeight:'bold',padding:'14px 40px'}} href={verifyUrl}>
            Verify Email Address
          </Button>
        </Section>
        {verifyCode && (
          <Section style={{textAlign:'center' as const}}>
            <Code style={{backgroundColor:'#f3f4f6',padding:'16px 24px',borderRadius:'8px',fontSize:'24px',fontWeight:'bold'}}>{verifyCode}</Code>
          </Section>
        )}
      </Section>
    </BaseLayout>
  );
};

export default VerifyEmail;
