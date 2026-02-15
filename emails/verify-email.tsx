import { Section, Text, Button, Code } from '@react-email/components';
import * as React from 'react';
import { BaseLayout } from './base-layout';

interface VerifyEmailProps {
  verifyUrl: string;
  verifyCode?: string;
}

export const VerifyEmail = ({ verifyUrl, verifyCode }: VerifyEmailProps) => {
  return (
    <BaseLayout preview="Verify your email address for Frametale">
      <Section style={content}>
        <Text style={heading}>✉️ Verify Your Email</Text>
        
        <Text style={paragraph}>
          Thanks for signing up! To complete your registration and access all features, 
          please verify your email address.
        </Text>

        <Section style={buttonContainer}>
          <Button style={button} href={verifyUrl}>
            Verify Email Address
          </Button>
        </Section>

        {verifyCode && (
          <>
            <Text style={paragraph}>
              Or enter this code manually:
            </Text>
            <Section style={codeContainer}>
              <Code style={code}>{verifyCode}</Code>
            </Section>
          </>
        )}

        <Section style={infoBox}>
          <Text style={infoText}>
            🔒 This link will expire in 24 hours. If you didn't create an account with Frametale, 
            you can safely ignore this email.
          </Text>
        </Section>
      </Section>
    </BaseLayout>
  );
};

export default VerifyEmail;

const content = {
  padding: '30px 40px',
};

const heading = {
  fontSize: '32px',
  lineHeight: '1.3',
  fontWeight: '700',
  color: '#1f2937',
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

const codeContainer = {
  textAlign: 'center' as const,
  margin: '20px 0',
};

const code = {
  backgroundColor: '#f3f4f6',
  padding: '16px 24px',
  borderRadius: '8px',
  fontSize: '24px',
  fontWeight: 'bold',
  letterSpacing: '4px',
  color: '#1f2937',
};

const infoBox = {
  backgroundColor: '#fef3c7',
  padding: '16px',
  borderRadius: '8px',
  margin: '30px 0',
};

const infoText = {
  fontSize: '14px',
  lineHeight: '22px',
  color: '#92400e',
  margin: '0',
};
