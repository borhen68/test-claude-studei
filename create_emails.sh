#!/bin/bash

# Welcome email
cat > emails/welcome.tsx << 'EOF'
import { Section, Text, Button, Hr } from '@react-email/components';
import * as React from 'react';
import { BaseLayout } from './base-layout';

interface WelcomeEmailProps {
  name?: string;
  verifyUrl?: string;
  unsubscribeUrl?: string;
}

export const WelcomeEmail = ({ name, verifyUrl, unsubscribeUrl }: WelcomeEmailProps) => {
  return (
    <BaseLayout preview="Welcome to Frametale!" unsubscribeUrl={unsubscribeUrl}>
      <Section style={{padding:'30px 40px'}}>
        <Text style={{fontSize:'32px',fontWeight:'700',textAlign:'center' as const,margin:'0 0 30px'}}>
          🎉 Welcome to Frametale!
        </Text>
        <Text style={{fontSize:'16px',margin:'16px 0'}}>Hi {name || 'there'},</Text>
        <Text style={{fontSize:'16px',margin:'16px 0'}}>
          We're thrilled to have you here! Frametale makes it easy to turn your favorite photos into beautiful, professionally printed photo books.
        </Text>
        {verifyUrl && (
          <Section style={{textAlign:'center' as const,margin:'30px 0'}}>
            <Button style={{backgroundColor:'#ec4899',borderRadius:'25px',color:'#fff',fontSize:'16px',fontWeight:'bold',padding:'14px 40px'}} href={verifyUrl}>
              Verify Email Address
            </Button>
          </Section>
        )}
        <Hr style={{borderColor:'#e5e7eb',margin:'30px 0'}} />
        <Text style={{fontSize:'16px',margin:'12px 0'}}>📸 <strong>Upload your photos</strong></Text>
        <Text style={{fontSize:'16px',margin:'12px 0'}}>🎨 <strong>AI-powered layouts</strong></Text>
        <Text style={{fontSize:'16px',margin:'12px 0'}}>📖 <strong>Print & ship</strong></Text>
      </Section>
    </BaseLayout>
  );
};

export default WelcomeEmail;
EOF

# Verify email
cat > emails/verify-email.tsx << 'EOF'
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
EOF

echo "Email templates created successfully!"
